requirejs([],
    function (uuid) {
        $(document).ready(async function () {
            var xml = await R.agetFile('/pages/dashboard/index.xml', '');
            $('#content-body-section').html(xml);

            var o, e, r, t, a, s, i, l, n, d, h, c = "#f3f3f3",
                w = "#EBEBEB",
                p = "#b9b9c3",
                u = document.querySelector("#statistics-order-chart"),
                g = document.querySelector("#statistics-profit-chart"),
                b = document.querySelector("#earnings-chart"),
                y = document.querySelector("#revenue-report-chart"),
                m = document.querySelector("#budget-chart");
            setTimeout((function () {}), 2e3),
                new ApexCharts(u, oOptions).render(), 
                new ApexCharts(g, eOptions).render(), 
                new ApexCharts(b, rOptions).render(), 
                new ApexCharts(y, tOptions).render(), 
                new ApexCharts(m, aOptions).render()


        });
    }
);
var c = "#f3f3f3";
var w = "#EBEBEB";
var p = "#b9b9c3";
var oOptions = {
    chart: {
        height: 70,
        type: "bar",
        stacked: !0,
        toolbar: {
            show: !1
        }
    },
    grid: {
        show: !1,
        padding: {
            left: 0,
            right: 0,
            top: -15,
            bottom: -15
        }
    },
    plotOptions: {
        bar: {
            horizontal: !1,
            columnWidth: "20%",
            startingShape: "rounded",
            colors: {
                backgroundBarColors: [c, c, c, c, c],
                backgroundBarRadius: 5
            }
        }
    },
    legend: {
        show: !1
    },
    dataLabels: {
        enabled: !1
    },
    colors: [window.colors.solid.warning],
    series: [{
        name: "2020",
        data: [45, 85, 65, 45, 65]
    }],
    xaxis: {
        labels: {
            show: !1
        },
        axisBorder: {
            show: !1
        },
        axisTicks: {
            show: !1
        }
    },
    yaxis: {
        show: !1
    },
    tooltip: {
        x: {
            show: !1
        }
    }
};
var eOptions = {
    chart: {
        height: 70,
        type: "line",
        toolbar: {
            show: !1
        },
        zoom: {
            enabled: !1
        }
    },
    grid: {
        borderColor: w,
        strokeDashArray: 5,
        xaxis: {
            lines: {
                show: !0
            }
        },
        yaxis: {
            lines: {
                show: !1
            }
        },
        padding: {
            top: -30,
            bottom: -10
        }
    },
    stroke: {
        width: 3
    },
    colors: [window.colors.solid.info],
    series: [{
        data: [0, 20, 5, 30, 15, 45]
    }],
    markers: {
        size: 2,
        colors: window.colors.solid.info,
        strokeColors: window.colors.solid.info,
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [{
            seriesIndex: 0,
            dataPointIndex: 5,
            fillColor: "#ffffff",
            strokeColor: window.colors.solid.info,
            size: 5
        }],
        shape: "circle",
        radius: 2,
        hover: {
            size: 3
        }
    },
    xaxis: {
        labels: {
            show: !0,
            style: {
                fontSize: "0px"
            }
        },
        axisBorder: {
            show: !1
        },
        axisTicks: {
            show: !1
        }
    },
    yaxis: {
        show: !1
    },
    tooltip: {
        x: {
            show: !1
        }
    }
};
var aOptions = {
    chart: {
        height: 80,
        toolbar: {
            show: !1
        },
        zoom: {
            enabled: !1
        },
        type: "line",
        sparkline: {
            enabled: !0
        }
    },
    stroke: {
        curve: "smooth",
        dashArray: [0, 5],
        width: [2]
    },
    colors: [window.colors.solid.primary, "#dcdae3"],
    series: [{
        data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
    }, {
        data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27]
    }],
    tooltip: {
        enabled: !1
    }
};
var rOptions = {
    chart: {
        type: "donut",
        height: 120,
        toolbar: {
            show: !1
        }
    },
    dataLabels: {
        enabled: !1
    },
    series: [53, 16, 31],
    legend: {
        show: !1
    },
    comparedResult: [2, -3, 8],
    labels: ["App", "Service", "Product"],
    stroke: {
        width: 0
    },
    colors: ["#28c76f66", "#28c76f33", window.colors.solid.success],
    grid: {
        padding: {
            right: -20,
            bottom: -8,
            left: -20
        }
    },
    plotOptions: {
        pie: {
            startAngle: -10,
            donut: {
                labels: {
                    show: !0,
                    name: {
                        offsetY: 15
                    },
                    value: {
                        offsetY: -15,
                        formatter: function (o) {
                            return parseInt(o) + "%"
                        }
                    },
                    total: {
                        show: !0,
                        offsetY: 15,
                        label: "App",
                        formatter: function (o) {
                            return "53%"
                        }
                    }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 1325,
        options: {
            chart: {
                height: 100
            }
        }
    }, {
        breakpoint: 1200,
        options: {
            chart: {
                height: 120
            }
        }
    }, {
        breakpoint: 1045,
        options: {
            chart: {
                height: 100
            }
        }
    }, {
        breakpoint: 992,
        options: {
            chart: {
                height: 120
            }
        }
    }]
};
var tOptions = {
    chart: {
        height: 230,
        stacked: !0,
        type: "bar",
        toolbar: {
            show: !1
        }
    },
    plotOptions: {
        bar: {
            columnWidth: "17%",
            endingShape: "rounded"
        },
        distributed: !0
    },
    colors: [window.colors.solid.primary, window.colors.solid.warning],
    series: [{
        name: "Earning",
        data: [95, 177, 284, 256, 105, 63, 168, 218, 72]
    }/*, {
        name: "Expense",
        data: [-145, -80, -60, -180, -100, -60, -85, -75, -100]
    }*/],
    dataLabels: {
        enabled: !1
    },
    legend: {
        show: !1
    },
    grid: {
        padding: {
            top: -20,
            bottom: -10
        },
        yaxis: {
            lines: {
                show: !1
            }
        }
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        labels: {
            style: {
                colors: p,
                fontSize: "0.86rem"
            }
        },
        axisTicks: {
            show: !1
        },
        axisBorder: {
            show: !1
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: p,
                fontSize: "0.86rem"
            }
        }
    }
}
$(window).on("load", (function () {
    "use strict";

}));