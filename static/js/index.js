$(document).ready(function () {

function calculate_emi(principal,interest,number_of_months){
    let numerator_value=(1+interest)
    let numerator_value_total=Math.pow(numerator_value,number_of_months);
    return Math.round(principal*interest*((numerator_value_total)/(numerator_value_total-1)));
}

function draw_pie_chart(values) {
    let ctx1 = $("#myChart");
    let labels=['Principal Loan Amount','Total Interest']
    let data1={
        labels:labels,
        datasets:[
            {
                label:'Break-up of Total Payment',
                data:values,
                backgroundColor: [

                  "#DC143C",
                  "#F4A460",

                ],
            }
        ]
    }
    var options = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      text: "Break-up of total payment",
      fontSize: 18,
      fontColor: "#111"
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        fontColor: "#333",
        fontSize: 16
      }
    }
  };

  //create Chart class object
  var chart1 = new Chart(ctx1, {
    type: "pie",
    data: data1,
    options: options
  });

}
function get_table_values(emi_amount,total_amount_of_money,loan_amount){
    let amount=$('#amount').val();
    let interest=$('#interest').val();
    let tenure=$('#tenure').val();
    if (Number.isNaN(emi_amount)){
        console.log('Error')
    }else {
        let csrf = $('input[name="csrfmiddlewaretoken"]').val()


        $.ajax({
            url: '/calculate_table_values/',
            data: {
                'amount': amount,
                'interest': interest,
                'tenure': tenure,
                'loan_amount': loan_amount,
                'loan_emi': emi_amount,
                'total_amount_of_money': total_amount_of_money,
                'csrfmiddlewaretoken': csrf,
            },
            method: 'post',
            dataType: 'json',
            success: function (data) {


                let json_string = JSON.stringify(data);
                let json_data = JSON.parse(json_string)
                $('#chart-container').empty()
                $('#input-data-body').empty()
                $('#chart-container').append(
                    '<canvas id="mixed-chart" style="width:100%;max-width:700px"></canvas>'
                )
                let bar_chart_labels = []
                let bar_chart_data = []
                let remaining_balance_data = []
                let principal_data = []
                let interest_data = []
                for (let i = 0; i <= json_data.length; i++) {
                    try {
                        bar_chart_labels.push(json_data[i].monthly_data[0].year);
                        bar_chart_data.push(json_data[i].year_total_payment);
                        principal_data.push(json_data[i].year_total_principal);
                        interest_data.push(json_data[i].year_total_interest);

                        remaining_balance_data.push(json_data[i].year_total_balance);

                        $('#input-data-body').append(
                            '<tr class="accordion-toggle collapsed" id="accordion"' + i + ' data-toggle="collapse" data-parent="#accordion"' + i + ' href="#collapseOne">\n' +
                            '            <td class="expand-button">' + json_data[i].monthly_data[0].year + '</td>\n' +
                            '            <td>' + json_data[i].year_total_principal + '</td>\n' +
                            '            <td>' + json_data[i].year_total_interest + '</td>\n' +
                            '            <td>' + json_data[i].year_total_payment + '</td>\n' +
                            '            <td>' + json_data[i].year_total_balance + '</td>\n' +
                            '            <td>' + json_data[i].year_total_loan_to_be_paid_today + '</td>\n' +
                            '\n' +
                            '            </tr>'
                        )


                        let inner_data = json_data[i].monthly_data

                        for (let j = 0; j <= inner_data.length; j++) {

                            try {
                                $('#input-data-body').append(
                                    '<tr class="hide-table-padding">\n' +
                                    '\n' +
                                    '            <td colspan="7">\n' +
                                    '            <div id="collapseOne" class="in p-3 collapse hide" style="">\n' +
                                    '\n' +
                                    '              <div class="row">\n' +
                                    '                <div class="col-1">' + inner_data[j].month_data.mont_name + '</div>\n' +
                                    '\n' +
                                    '                <div class="col-2">' + inner_data[j].month_data.principal + '</div>\n' +
                                    '                <div class="col-2">' + inner_data[j].month_data.interest + '</div>\n' +
                                    '                <div class="col-3">' + inner_data[j].month_data.total_payment + '</div>\n' +
                                    '                <div class="col-2">' + inner_data[j].month_data.balance + '</div>\n' +
                                    '                <div class="col-2">' + inner_data[j].month_data.loan_to_be_paid_to_date + '</div>\n' +
                                    '              </div>\n' +
                                    '\n' +
                                    '            </div>\n' +
                                    '\n' +
                                    '            </td>\n' +
                                    '            </tr>'
                                )
                            } catch {
                                break;
                            }
                        }
                    } catch {
                        break;
                    }

                }

                $('#chart').empty()
                var options = {
                    series: [
                        {
                            name: 'Principal Amount',
                            data: principal_data,
                            type: 'column'
                        },
                        {
                            name: 'Interest Amount',
                            data: interest_data,
                            type: 'column',
                        },
                        {
                            name: 'Balance',
                            data: remaining_balance_data,
                            type: 'line',
                        },

                    ],
                    chart: {
                        id: 'chart1',
                        height: 350,
                        stacked: true,
                        type: 'line',
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    stroke: {
                        width: [0, 4]
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0
                            }
                        }
                    }],
                    plotOptions: {
                        bar: {
                            horizontal: false,

                        },
                    },
                    xaxis: {
                        type: 'number',
                        categories: bar_chart_labels,
                    },
                    yaxis: [{
                        title: {
                            text: 'EMI payment per year',
                        },

                    }, {
                        opposite: true,
                        title: {
                            text: 'Balance',
                        }
                    }],
                    legend: {
                        position: 'right',
                        offsetY: 40
                    },
                    fill: {
                        opacity: 1
                    },
                    noData: {
                        text: 'Loading...'
                    }
                };

                var chart = new ApexCharts(document.querySelector("#chart"), options);
                chart.render();

            }
        })
    }

}
function get_table_values_home_loan(emi_amount,total_amount_of_money,taxes_insurance_maintainance,loan_amount){
    let amount=$('#amount').val();
    let interest=$('#interest').val();
    let tenure=$('#tenure').val();
    let csrf=$('input[name="csrfmiddlewaretoken"]').val()
        if (Number.isNaN(emi_amount)){
        console.log('Error')
    }else {

            $.ajax({
                url: '/calculate_table_values_home_loan/',
                data: {
                    'amount': amount,
                    'interest': interest,
                    'taxes_insurance_maintainance': taxes_insurance_maintainance,
                    'tenure': tenure,
                    'loan_emi': emi_amount,
                    'loan_amount': loan_amount,
                    'total_amount_of_money': total_amount_of_money,
                    'csrfmiddlewaretoken': csrf,
                },
                method: 'post',
                dataType: 'json',
                success: function (data) {


                    let json_string = JSON.stringify(data);
                    let json_data = JSON.parse(json_string)
                    $('#chart-container').empty()
                    $('#input-data-body').empty()
                    $('#chart-container').append(
                        '<canvas id="mixed-chart" style="width:100%;max-width:700px"></canvas>'
                    )
                    let bar_chart_labels = []
                    let bar_chart_data = []
                    let remaining_balance_data = []
                    let principal_data = []
                    let interest_data = []
                    for (let i = 0; i <= json_data.length; i++) {
                        try {
                            bar_chart_labels.push(json_data[i].monthly_data[0].year);
                            bar_chart_data.push(json_data[i].year_total_payment);
                            principal_data.push(json_data[i].year_total_principal);
                            interest_data.push(json_data[i].year_total_interest);

                            remaining_balance_data.push(json_data[i].year_total_balance);

                            $('#input-data-body').append(
                                '<tr class="accordion-toggle collapsed" id="accordion"' + i + ' data-toggle="collapse" data-parent="#accordion"' + i + ' href="#collapseOne">\n' +
                                '            <td class="expand-button">' + json_data[i].monthly_data[0].year + '</td>\n' +
                                '            <td class="margin-left:5px;">' + json_data[i].year_total_principal + '</td>\n' +
                                '            <td>' + json_data[i].year_total_interest + '</td>\n' +
                                '            <td>' + json_data[i].year_taxes_insurance_maintainance + '</td>\n' +
                                '            <td>' + json_data[i].year_total_payment + '</td>\n' +
                                '            <td>' + json_data[i].year_total_balance + '</td>\n' +
                                '            <td>' + json_data[i].year_total_loan_to_be_paid_today + '</td>\n' +
                                '\n' +
                                '            </tr>'
                            )


                            let inner_data = json_data[i].monthly_data

                            for (let j = 0; j <= inner_data.length; j++) {

                                try {
                                    $('#input-data-body').append(
                                        '<tr class="hide-table-padding">\n' +
                                        '\n' +
                                        '            <td colspan="7">\n' +
                                        '            <div id="collapseOne" class="in p-3 collapse hide" style="">\n' +
                                        '\n' +
                                        '              <div class="row">\n' +
                                        '                <div class="col-1">' + inner_data[j].month_data.mont_name + '</div>\n' +
                                        '\n' +
                                        '                <div class="col-2">' + inner_data[j].month_data.principal + '</div>\n' +
                                        '                <div class="col-2">' + inner_data[j].month_data.interest + '</div>\n' +
                                        '                <div class="col-2">' + inner_data[j].month_data.taxes_insurance_maintainance + '</div>\n' +
                                        '                <div class="col-2">' + inner_data[j].month_data.total_payment + '</div>\n' +
                                        '                <div class="col-1">' + inner_data[j].month_data.balance + '</div>\n' +
                                        '                <div class="col-1">' + inner_data[j].month_data.loan_to_be_paid_to_date + '</div>\n' +
                                        '              </div>\n' +
                                        '\n' +
                                        '            </div>\n' +
                                        '\n' +
                                        '            </td>\n' +
                                        '            </tr>'
                                    )
                                } catch {
                                    break;
                                }
                            }
                        } catch {
                            break;
                        }

                    }

                    $('#chart').empty()
                    var options = {
                        series: [
                            {
                                name: 'Principal Amount',
                                data: principal_data,
                                type: 'column'
                            },
                            {
                                name: 'Interest Amount',
                                data: interest_data,
                                type: 'column',
                            },
                            {
                                name: 'Balance',
                                data: remaining_balance_data,
                                type: 'line',
                            },

                        ],
                        chart: {
                            id: 'chart1',
                            height: 350,
                            stacked: true,
                            type: 'line',
                            toolbar: {
                                show: true
                            },
                            zoom: {
                                enabled: true
                            }
                        },
                        stroke: {
                            width: [0, 4]
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                legend: {
                                    position: 'bottom',
                                    offsetX: -10,
                                    offsetY: 0
                                }
                            }
                        }],
                        plotOptions: {
                            bar: {
                                horizontal: false,

                            },
                        },
                        xaxis: {
                            type: 'number',
                            categories: bar_chart_labels,
                        },
                        yaxis: [{
                            title: {
                                text: 'EMI payment per year',
                            },

                        }, {
                            opposite: true,
                            title: {
                                text: 'Balance',
                            }
                        }],
                        legend: {
                            position: 'right',
                            offsetY: 40
                        },
                        fill: {
                            opacity: 1
                        },
                        noData: {
                            text: 'Loading...'
                        }
                    };

                    var chart = new ApexCharts(document.querySelector("#chart"), options);
                    chart.render();

                }
            })
        }

}
function calculate_all_values(){
    let input_amount=$('#amount').val();
    let input_interest=$('#interest').val();
    let input_tenure=$('#tenure').val();
    let int_input_amount=parseFloat(input_amount);
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    console.log('this is emi amount',emi_amount)
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid],int_input_amount)
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
}
function draw_home_pie_chart(data_list) {
    $('#home-pie-chart').empty();
    var options = {
          series: data_list,
                      labels: ['Down Payment, Fees & One-time Expenses', 'Principal', 'Interest', 'Taxes, Home Insurance & Maintenance'],

          chart: {
              id: 'chart1',
          width: 580,
          type: 'pie',
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
            stroke: {
          width: [0, 4]
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,

          },
        },

        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        },
     noData: {
    text: 'Loading...'
  }
        };

        var chart = new ApexCharts(document.querySelector("#home-pie-chart"), options);
        chart.render();
}
function calculate_all_home_values(){

    let input_home_value=$('#home-value').val();
    let input_loan_insurance=$('#loan-insurance').val();
    let input_down_payment=$('#down-payment').val();
    let down_payment_value=parseFloat(input_home_value)*(parseFloat(input_down_payment)/100)
    let loan_amount=parseFloat(input_home_value)+parseFloat(input_loan_insurance)-down_payment_value;
    $('#loan-amount').val(loan_amount);

    let input_interest=$('#interest').val();
    let input_fees=$('#fees').val();
    let loan_feesValue=parseFloat(input_fees)/100*loan_amount
    loan_amount+=loan_feesValue;
    let input_tenure=$('#tenure').val();
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=loan_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);

    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }

    let input_property_taxes=$('#property-taxes-per-year').val()
    let property_taxes=parseFloat(input_property_taxes)
    let property_taxes_value=property_taxes
    $('#property-tax').text(property_taxes_value/12)
    let home_insurance_per_year=parseFloat($('#home-insurance-per-year').val())
    $('#home-insurance').text(home_insurance_per_year/12)
    let maintanance_input=parseFloat($('#maintanance-expenses-per-month').val())
    $('#maintanance').text(maintanance_input);
    let total_amount_to_be_paid=emi_amount*int_input_tenure;

    let total_monthly_payment=emi_amount+(property_taxes/12)+(home_insurance_per_year/12)+maintanance_input
    $('#total-monthly-payment').text(total_monthly_payment)

    let down_payment_fees_one_time=down_payment_value+loan_feesValue+parseFloat($('#one-time-expenses').val())

    let total_payment=emi_amount*int_input_tenure
    let total_intrest=total_payment-loan_amount
    let taxes_home_insurance=(property_taxes_value*int_input_tenure/12)+(home_insurance_per_year*int_input_tenure/12)+(maintanance_input*int_input_tenure)
    let total_of_all_payments=down_payment_fees_one_time+loan_amount+total_intrest+taxes_home_insurance
    let home_data_values=[down_payment_fees_one_time,loan_amount,total_intrest,taxes_home_insurance]
    $('#down_payment_fees_one_time').text(down_payment_fees_one_time);
    $('#principal-loan-amount').text(loan_amount);
    $('#total_intrest').text(total_intrest);
    $('#taxes_home_insurance').text(taxes_home_insurance);
    $('#total_of_all_payments').text(total_of_all_payments);
    draw_home_pie_chart(home_data_values)
    get_table_values_home_loan(emi_amount,total_of_all_payments,taxes_home_insurance,loan_amount)
    //get_table_values(emi_amount,total_amount_of_money);
}

calculate_all_values();
calculate_all_home_values()
   $('#home-value').on('change',function () {
       calculate_all_home_values();
   })
    $('#tenure').on('change',function () {
       calculate_all_home_values();
   })
    $('#down-payment').on('change',function () {
       calculate_all_home_values();
   })
     $('#loan-insurance').on('change',function () {
       calculate_all_home_values();
   })
         $('#loan-amount').on('change',function () {
       calculate_all_home_values();
   })
             $('#interest').on('change',function () {
       calculate_all_home_values();
   })
                 $('#fees').on('change',function () {

       calculate_all_home_values();
   })
    $('#start-month-year').on('change',function () {

       calculate_all_home_values();
   })
    $('#one-time-expenses').on('change',function () {

       calculate_all_home_values();
   })
    $('#property-taxes-per-year').on('change',function () {

       calculate_all_home_values();
   })
    $('#home-insurance-per-year').on('change',function () {

       calculate_all_home_values();
   })
    $('#maintanance-expenses-per-month').on('change',function () {

       calculate_all_home_values();
   })


$('#myRange').on('change',function (e) {
    $('#amount').val($(this).val());
    let input_amount=$(this).val();
    let input_interest=$('#interest').val();
    let input_tenure=$('#tenure').val();
    let int_input_amount=parseFloat(input_amount);
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);

})
    $('#interestRange').on('change',function (e) {
        $('#interest').val($(this).val());
        let input_amount=$('#amount').val();
        let input_interest=$(this).val();
        let input_tenure=$('#tenure').val();
        let int_input_amount=parseFloat(input_amount);
        let int_input_intrest=parseFloat(input_interest);
        let int_input_tenure=parseFloat(input_tenure);
        let interest_rate_per_month=int_input_intrest/12/100;
        let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
    })
    $('#tenureRange').on('change',function (e) {
        $('#tenure').val($(this).val());
        let input_amount=$('#amount').val();
        let input_interest=$('#interest').val();
        let input_tenure=$(this).val();
        let int_input_amount=parseFloat(input_amount);
        let int_input_intrest=parseFloat(input_interest);
        let int_input_tenure=parseFloat(input_tenure);
        let interest_rate_per_month=int_input_intrest/12/100;
        let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
    })
$('#amount').keyup(function(){
    let input_amount=$(this).val();
    let input_interest=$('#interest').val();
    let input_tenure=$('#tenure').val();
    $('#myRange').val(input_amount);
    let int_input_amount=parseFloat(input_amount);
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
})
  $('#interest').keyup(function(){
    let input_amount=$('#amount').val();
    let input_interest=$(this).val();
    let input_tenure=$('#tenure').val();
    $('#interestRange').val(input_interest);
    let int_input_amount=parseFloat(input_amount);
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
})

    $('#tenure').keyup(function(){
    let input_amount=$('#amount').val();
    let input_interest=$('#interest').val();
    let input_tenure=$(this).val();
    $('#tenureRange').val(input_tenure);
    let int_input_amount=parseFloat(input_amount);
    let int_input_intrest=parseFloat(input_interest);
    let int_input_tenure=parseFloat(input_tenure);
    let interest_rate_per_month=int_input_intrest/12/100;
    let emi_amount=calculate_emi(principal=int_input_amount,interest=interest_rate_per_month,number_of_months=int_input_tenure);
    if (Number.isNaN(emi_amount)){
        console.log('error')
    }else{
        $('#emi-amount').text(emi_amount);
    }
    let total_amount_to_be_paid=emi_amount*int_input_tenure;
    let total_interest_paid=total_amount_to_be_paid-input_amount;
    $('#total-intrest-paid').text(total_interest_paid);
    let total_amount_of_money=int_input_amount+total_interest_paid;
    $('#total-payment').text(total_amount_of_money);
    draw_pie_chart([int_input_amount,total_interest_paid]);
    get_table_values(emi_amount,total_amount_of_money,int_input_amount);
})

})