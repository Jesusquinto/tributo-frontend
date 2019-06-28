  export const  data : any = {
        labels: ["Atlantico", "Chachagüí","Uni. nariño"],
        datasets: [{
          label: 'Tributos pagados',
          data: [24, 20, 10,],
        },
      ]
    }
    export const  data2 : any = {
        labels: ["Atlantico", "Chachagüí","Uni. nariño",],
        datasets: [{
          label: 'Pagado en tributos',
          data: [ 3000, 150, 400,],
        },
      ]
    }

  export const  options: any = {
        scales: {
          yAxes: [{
            gridLines: {
              color: '#212529',
              zeroLineColor: '#212529'
            },
          }]
        }
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