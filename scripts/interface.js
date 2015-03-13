'use strict';
/*global $:false */

$(document).ready(function() {
  $('[data-toggle="popover"]').popover({ container: 'body' });

  var viewNum = 0;

  $('.interface-view').css({'height': ($(window).height())});
  $(window).on('resize', function() {
    $('.interface-view').css({'height': ($(window).height())});
  });

  $(window).on('scroll', function() {
    var distFromTop = $('body').scrollTop()-$('nav').height();
    viewNum = Math.round(distFromTop / $('.interface-view').height());

    if (viewNum < 0) {
      viewNum = 0;
    }
    if (viewNum === 0) {
      $('#up-button').css('display', 'none');
    }
    else if (viewNum === 2) {
      $('#dn-button').css('display', 'none');
    }
    else {
      $('#up-button').css('display', 'inherit');
      $('#dn-button').css('display', 'inherit');
    }
  });

  $('#up-button').click(function() {
    var offset = $('nav').height();
    console.log(viewNum);
    viewNum -= 1;
    $('html,body').animate({
      scrollTop: offset + viewNum*$('.interface-view').height()
    }, 'fast');
  });

  $('#dn-button').click(function() {
    var offset = $('nav').height();
    console.log(viewNum);
    viewNum += 1;
    $('html,body').animate({
      scrollTop: offset + viewNum*$('.interface-view').height()
    }, 'fast');
  });
});

/*$(document).ready(function() {
  var viewNum = 0;
  window.scrollTo(0,0);

  $(window).on('scroll', function() {
    viewNum = Math.round($('body').scrollTop() / $(window).height());
  });

  document.addEventListener("mousewheel", function(e) {
    if (e.wheelDelta < 0) {
      if (viewNum < 2) {
        viewNum += 1;
        $('html,body').animate({scrollTop: viewNum*$(window).height()}, 'fast');
        if (viewNum > 2)
          viewNum = 2;
        return false;
      }
      else
        $('html,body').animate({scrollTop: 2*$(window).height()}, 'fast');
        return false;
    }
    else {
      if (viewNum > 0) {
        viewNum -= 1;
        $('html,body').animate({scrollTop: viewNum*$(window).height()}, 'fast');
        if (viewNum < 0)
          viewNum = 0;
        return false;
      }
      else
        $('html,body').animate({scrollTop: 0}, 'fast');
        return false;
    }
  }, false);
});*/