var birthday;

$(window).on('hashchange', function() {
  var hash = window.location.hash;
  var mdy = hash.substring(1);
  var parsed = moment(mdy, 'MM/DD/YYYY');
  birthday = parsed;
  refresh();
});

function setHash() {
  var fmt = birthday.format('MM/DD/YYYY');
  window.location.hash = '#' + fmt;
}

window.onresize = function() {
  refresh();
}

$(function() {
  var hash = window.location.hash;

  function initArray(years, weeks) {
  var count = 0;
  var year = [];
  for (var i = 0; i < years; i++) {
    var temp = [];
    for (var j = 0; j < weeks; j++) {
      temp.push(count);
      count++;
    }
    year.push(temp);
  }
  return year;
}

function uptoArray(num) {
  var arr = [];
  for (var i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}

var birth;

if (hash === '') {
       var bd = localStorage.getItem('birthday');

      if (!bd) {
        var bday = prompt("Please enter your birthdate", "March 20 1990");
        if (bday) {
          var parsed = moment(bday);
          localStorage.setItem('birthday', parsed);
          birthday = parsed;
          setHash();
        }
      } else {
        birthday = moment(bd);
        setHash();
      }
 
} else {
  var mdy = hash.substring(1);
  var parsed = moment(mdy, 'MM/DD/YYYY');
  birthday = parsed;
  // localStorage.setItem('birthday', parsed);
}

refresh = function() {
  //var birth = moment(localStorage.getItem('birthday'));
  birth = birthday;


  $('svg').remove();

  var now = moment();

// Get the users AGE
var age = now.diff(birth, 'years');

// Get the users DIFF since bday this year to NOW
var this_year_birthday = moment({year: moment().year(), month: birth.month(), day: birth.date()});
var rounded_sunday_birth = this_year_birthday.clone().day('Monday');

var into = Math.abs(now.diff(rounded_sunday_birth, 'weeks'));


if (this_year_birthday > now) {
  into = 52 - into;
} else {
  
}

var total_weeks = age * 52 + into;

var rounder_sunday_birth = birth.clone().day('Monday');
var now = moment();
var diff = now.diff(birth, 'weeks');

var $hour_countdown = $('#hour-progress');

// var data = [[1,7,6], [1,9,8]];
var data = initArray(80, 52);
var years = uptoArray(80);

var total_weeks_minus_one = --total_weeks;

var width = 585,
  height = 719,
  cellHeight = window.innerHeight / 95,
  cellWidth = 8,
  cellSize = 8,
  padding = 1,
  offset = 150;

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([20, 100])
  .html(function(d, i) {

    if (week % 52 === 0) {
      var amount = week / 52;
      var addYears = birthday.clone().add('years', amount);
      age = amount;
      fmt = addYears.format('MMM D YYYY');
    } else {
      var week = $(this).data('week');
      var round = Math.floor(week / 52) * 52;

      var amount = round / 52;
      var addYears = birthday.clone().add('years', amount);
      var addWeeks = addYears.add("weeks", week % 52);

      age = addWeeks.diff(birthday, 'years', true).toFixed(1);

      var fmt = addWeeks.format('MMM YYYY');
    }
    return fmt + ' - ' + age + ' years';
  })                

  var svg = d3.select('#cal')
              .append('svg')
              .attr('class', 'svg')
              .attr('width', 800)
              .attr('height', '98%');


  var rect = svg
             .selectAll('g')
             .data(data)
             .enter()
             .append('g')
             .attr('class', function(d, i) {
              return i;
             })

  var weeks = rect.selectAll('rect')
               .data(function(d) {
                return d;
               })
               .enter()
               .append('rect')
               .attr('class', function(d) {
                if (d < total_weeks) {
                  return 'graph-rect experienced';
                } else if (d === total_weeks_minus_one) {
                  return 'graph-rect experienced week-day-' + String(moment().weekday());
                }
                else {
                  return 'graph-rect';
                }
               })
               .attr('data-week', function(d) {
                return d;
               })
               .attr('x', function(d, i) {
                  return d % 52 * (cellWidth + 1) + offset ;
                })
                .attr('y', function(d, i) {
                    return Math.floor(d / 52) * (cellHeight + 1) 
                })
                .attr('width', cellWidth)
                .attr('height', cellHeight)
                             .on('mouseover', tip.show)
             .on('mouseout', tip.hide)


rect.call(tip);

   svg.selectAll('text')
       .data(years)
       .enter()
       .append("text")
       .attr('class', function(d) {
        if (d === 0) {
          return 'birthdate';
        } 
       })
       .text(function(d) {
        if (d === 0) {
          return birth.format('MMM DD, YYYY');
        } else if (d === 79) {
          return "80 Years old";
        }
      })
       .attr('x', function(d) {
        if (d === 0)
          return 40;
        else if (d === 79)
          return 40;
       })
       .attr('y', function(d) {
          if (d === 0)
            return 15;
          else if (d === 79) 
            return window.innerHeight - 40
       });
     }

       // Update the times on the side

       updateTimers();

       // $('.birthdate').on('click', function() {
        $('#cal').delegate('.birthdate', 'click', function() {
        var bday = prompt("Please enter your birthdate", "March 20 1990");
        if (bday) {
          var parsed = moment(bday);
          localStorage.setItem('birthday', parsed);
          birthday = parsed;
          setHash();
          refresh();
        }
       });

        refresh();

       function updateTimers() {
          var minutes = moment().minutes();
          var hours = moment().hours();
          var days = moment().weekday() -1;
          var days_month = moment().date();
          var days_year = moment().dayOfYear();

          if (days < 0) {
            days = 7;
          }

          var minutes_left = 60 - minutes;
          var hours_left = 24 - hours;
          var days_left = 7 - days;
          var days_left_month = moment().daysInMonth() - days_month + 1;
          var days_left_year = 365 - days_year + 1;

          var minutes_left_string = String(scaleMinutes(minutes_left) + '%');
          var hours_left_string = String(scaleHours(hours_left) + '%');
          var days_left_string = String(scaleDays(days_left) + '%');
          var days_left_month_string = String(scaleDaysMonth(days_left_month) + '%');
          var days_left_year_string = String(scaleDaysYear(days_left_year) + '%');

          $('#hour-progress').css("width", minutes_left_string);
          $('#hour-progress').html(minutes_left + ' minutes');

          $('#day-progress').css("width", hours_left_string);
          $('#day-progress').html(hours_left + ' hours');

          $('#week-progress').css("width", days_left_string);
          $('#week-progress').html(days_left + ' days'); 

          $('#month-progress').css("width", days_left_month_string);
          $('#month-progress').html(days_left_month + ' days'); 

          $('#year-progress').css("width", days_left_year_string);
          $('#year-progress').html(days_left_year + ' days');          

          setTimeout(updateTimers, 30000);
        }

        function scaleMinutes(minute) {
          return (minute / 60) * 100;
        }

        function scaleHours(hour) {
          return (hour / 24) * 100;
        }

        function scaleDays(day) {
          return (day / 7) * 100;
        }

        function scaleDaysMonth(day) {
          return (day / moment().daysInMonth()) * 100;
        }

        function scaleDaysYear(day) {
          return (day / 365) * 100;
        }
});