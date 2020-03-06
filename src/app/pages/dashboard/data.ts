


    export const  data2 : any = {
        labels: ["Atlantico", "Chachagüí","Uni. nariño",],
        datasets: [{
          label: 'Pagado en tributos',
          data: [ 3000, 150, 400,],
        },
      ]
    };

export function getOptions(data: any): any {
  const options: any = {
    scales: {
      yAxes: [{
        gridLines: {
          color: '#212529',
          zeroLineColor: '#212529',
        },
    ticks: {
      callback: function(value) {
          return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    },
      }]
    },
    tooltips: {
      enabled: false,
      custom: function (tooltipModel) {
        var tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.classList.add('tooltip');
            tooltipEl.id = 'chartjs-tooltip';
            document.body.appendChild(tooltipEl);
        }




        if (!tooltipModel) {
          tooltipEl.style.opacity = '0';
            return;
        }


        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
      }


        tooltipEl.classList.add(tooltipModel.yAlign);
        const i = tooltipModel.dataPoints[0].index;
        console.log(data);
        const valor =  '$' + data[i].valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          const innerHtml = '<div class="container">' +
                              '<div class="row">' +
                                '<div class="col-6" style="text-align: center;">' +
                                  '<i class="ni ni-calendar-grid-58 mb-0 pb-0"></i>' +
                                  '<h6 style="color: white" class="mt-0 pt-0">' + data[i].mes.split('-')[1] + '</h6>' +
                                  '<h6  style="color: white">' + valor + '</h6>' +
                                  '</div>' +
                                '<div class="col-6" style="text-align: center; border-left: 1px solid white; ">' +
                                '<i class="ni ni-paper-diploma mb-0"></i>' +
                                '<h6 style="color: white" class="mt-0">' + data[i].tramites + ' tramites' + '</h6>' +
                                '</div>' +
                              '</div>' +
                              '<div class="row mt-2" >' +
                                '<div class="col-12" style="text-align: center">' +
                                      '<div style="background: #192f54d6; padding: 10px; border-radius: 7px">' +
                                      '<i class="ni ni-chart-bar-32 mb-0 pb-0"></i>' +
                                        '<h5 style="color: white" class="mb-0 pb-0"> Entidad mas frecuente </h5>' +
                                            '<h6 style="color: white" class="mt-0 pt-0">' + data[i].frecuente + '</h6>' +
                                      '</div>' +
                                    '</div>' +
                              '</div>' +
                          '</div>';
        tooltipEl.innerHTML = innerHtml;
        document.body.appendChild(tooltipEl);

        const position = this._chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
        tooltipEl.style.padding = '10px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.background = 'rgba(1, 3, 35, 0.7)';
        tooltipEl.style.color = 'white';
        tooltipEl.style.webkitTransition = 'all .3s ease';
        tooltipEl.style.transition = 'all .3s ease';
        tooltipEl.style.webkitTransform = 'translate(-50%, 0)';
        tooltipEl.style.transform = 'translate(-50%, 0)';
    }
  }
};
  return options;
}








    export const  options2: any = {
        scales: {
          yAxes: [{
            gridLines: {
              color: '#212529',
              zeroLineColor: '#212529'
            },
            ticks: {
              callback: function(value) {
                if (!(value % 10)) {
                  return '$' + value + 'k';
                }
              }
            }
          }]
        }
    }   