document.addEventListener('DOMContentLoaded', () => {
    const ctx1 = document.getElementById('chartVitesse');
    const ctx2 = document.getElementById('chartRegion');
    const ctx3 = document.getElementById('chartType');

    function getRegion(lat, lon) {
        // Île-de-France
        if (lat >= 48.1 && lat <= 49.2 && lon >= 1.4 && lon <= 3.6) return 'Île-de-France';
        // Provence-Alpes-Côte d'Azur
        if (lat >= 43.0 && lat <= 44.9 && lon >= 4.2 && lon <= 7.7) return 'PACA';
        // Auvergne-Rhône-Alpes
        if (lat >= 44.1 && lat <= 46.5 && lon >= 3.7 && lon <= 7.2) return 'Auvergne-Rhône-Alpes';
        // Nouvelle-Aquitaine
        if (lat >= 42.8 && lat <= 46.5 && lon >= -1.8 && lon <= 2.5) return 'Nouvelle-Aquitaine';
        // Occitanie
        if (lat >= 42.3 && lat <= 45.0 && lon >= 0.0 && lon <= 4.9) return 'Occitanie';
        // Grand Est
        if (lat >= 47.4 && lat <= 49.6 && lon >= 4.8 && lon <= 8.3) return 'Grand Est';
        // Hauts-de-France
        if (lat >= 49.0 && lat <= 51.1 && lon >= 1.4 && lon <= 4.3) return 'Hauts-de-France';
        // Normandie
        if (lat >= 48.2 && lat <= 50.0 && lon >= -1.9 && lon <= 1.8) return 'Normandie';
        // Bretagne
        if (lat >= 47.3 && lat <= 48.9 && lon >= -5.2 && lon <= -1.0) return 'Bretagne';
        // Pays de la Loire
        if (lat >= 46.3 && lat <= 48.6 && lon >= -2.6 && lon <= 0.9) return 'Pays de la Loire';
        // Centre-Val de Loire
        if (lat >= 46.3 && lat <= 48.9 && lon >= 0.1 && lon <= 3.1) return 'Centre-Val de Loire';
        // Bourgogne-Franche-Comté
        if (lat >= 46.2 && lat <= 48.4 && lon >= 2.8 && lon <= 7.2) return 'Bourgogne-Franche-Comté';
        // Corse
        if (lat >= 41.3 && lat <= 43.1 && lon >= 8.5 && lon <= 9.6) return 'Corse';
        return 'Autre';
    }

    fetch('geo-radar-france.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP " + response.status);
            }
            return response.json();
        })
        .then(radars => {
            const radars50 = radars.filter(r => String(r['vitesse_maximale_autorisee (km/h)']) === '50');
            const radars70 = radars.filter(r => String(r['vitesse_maximale_autorisee (km/h)']) === '70');
            const radars90 = radars.filter(r => String(r['vitesse_maximale_autorisee (km/h)']) === '90');
            const radars110 = radars.filter(r => String(r['vitesse_maximale_autorisee (km/h)']) === '110');
            const radars130 = radars.filter(r => String(r['vitesse_maximale_autorisee (km/h)']) === '130');

            new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: ['50 km/h', '70 km/h', '90 km/h', '110 km/h', '130 km/h'],
                    datasets: [{
                        label: 'Nombre de radars',
                        data: [
                            radars50.length,
                            radars70.length,
                            radars90.length,
                            radars110.length,
                            radars130.length
                        ],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(251, 191, 36, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(168, 85, 247, 0.8)'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 10,
                                font: {
                                    size: 10,
                                    family: 'Montserrat, sans-serif'
                                },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                family: 'Montserrat, sans-serif'
                            },
                            bodyFont: {
                                size: 13,
                                family: 'Montserrat, sans-serif'
                            },
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    let value = context.parsed || 0;
                                    let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    let percentage = ((value / total) * 100).toFixed(1);
                                    return label + ': ' + value + ' radars (' + percentage + '%)';
                                }
                            }
                        }
                    },
                    layout: {
                        padding: {
                            bottom: 5
                        }
                    }
                }
            });

            const regionCount = {};
            radars.forEach(radar => {
                const region = getRegion(radar.latitude, radar.longitude);
                regionCount[region] = (regionCount[region] || 0) + 1;
            });

            const sortedRegions = Object.entries(regionCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: sortedRegions.map(r => r[0]),
                    datasets: [{
                        label: 'Nombre de radars',
                        data: sortedRegions.map(r => r[1]),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        hoverBackgroundColor: 'rgba(37, 99, 235, 0.9)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                family: 'Montserrat, sans-serif'
                            },
                            bodyFont: {
                                size: 13,
                                family: 'Montserrat, sans-serif'
                            }
                        }
                    },
                    layout: {
                        padding: {
                            bottom: 10
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    family: 'Montserrat, sans-serif',
                                    size: 10
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    family: 'Montserrat, sans-serif',
                                    size: 9
                                },
                                maxRotation: 45,
                                minRotation: 45,
                                autoSkip: false
                            }
                        }
                    }
                }
            });

            const typeCount = {};
            radars.forEach(radar => {
                const type = radar.type_de_radar || 'Non spécifié';
                typeCount[type] = (typeCount[type] || 0) + 1;
            });

            const sortedTypes = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);

            new Chart(ctx3, {
                type: 'polarArea',
                data: {
                    labels: sortedTypes.map(t => t[0]),
                    datasets: [{
                        label: 'Nombre de radars',
                        data: sortedTypes.map(t => t[1]),
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(34, 197, 94, 0.7)',
                            'rgba(251, 191, 36, 0.7)',
                            'rgba(168, 85, 247, 0.7)',
                            'rgba(236, 72, 153, 0.7)'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 8,
                                font: {
                                    size: 9,
                                    family: 'Montserrat, sans-serif'
                                },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8,
                                maxWidth: 200
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 12,
                                family: 'Montserrat, sans-serif'
                            },
                            bodyFont: {
                                size: 11,
                                family: 'Montserrat, sans-serif'
                            }
                        }
                    },
                    scales: {
                        r: {
                            ticks: {
                                display: false
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    layout: {
                        padding: {
                            bottom: 5
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erreur lors du chargement :', error));
});