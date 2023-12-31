// const API_MAP = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCDnEC9XmlbUZkB9-3qIJ0ds2NyvWtuQrY&zoom=15';
'use strict';
$(document).ready(function() {
    const loading = '<div class="popup-backdrop fade in loading"><div class="modal-content popup-loading-indicator"></div></div>';
    if ($('#rev_slider_4').length) {
        $('#rev_slider_4').show().revolution({
            delay: 5000,
            startheight: 590,
            // autoHeight: 'on',
            hideTimerBar: 'off',
            fullScreenOffsetContainer: 'on',
            dottedOverlay: 'on',
            fullWidth: 'on',
            fullScreenAlignForce: 'on',
            minFullScreenHeight: 590
        });
    }

    if ($('.establishments-scroll').length) {
        $('.establishments-scroll').mCustomScrollbar();

        $(".callbacks a").click(function(e){
            e.preventDefault();
            $(this).parent().toggleClass("off");
            if($(e.target).parent().attr("id")==="alwaysTriggerOffsets"){
                var opts=$(".content").data("mCS").opt;
                if(opts.callbacks.alwaysTriggerOffsets){
                    opts.callbacks.alwaysTriggerOffsets=false;
                }else{
                    opts.callbacks.alwaysTriggerOffsets=true;
                }
            }
        });
    }

    function swicth_branch_buffet(){
        $('.buffet-branch .item-name .name-item').html($('.js-clone-item .item.uk-active .item-name').html());
        $('.buffet-branch .item-phone').html($('.js-clone-item .item.uk-active .item-phone').html());
        $('.buffet-branch .item-address').html($('.js-clone-item .item.uk-active .item-address').html());

        $('.establishments-list .item.uk-active').trigger('click');
    }
    if ($('.js-clone-item').length) {
        swicth_branch_buffet();
    }

    $(document).on('click', '.buffet-branch .switcher-branch', function(){
        var formBox = $(this).parents('.form-book-buffet');
        formBox.addClass('uk-hidden');
        formBox.prev().removeClass('uk-hidden');

        return false;
    });

    $(document).on('change', '[name="branch"]', function(){
        $('.js-clone-item .item').removeClass('uk-active');
        $('[data-branch="'+$(this).val()+'"].item').addClass('uk-active');

        $('.buffet-branch').show();
        if ($(this).val() == '') {
            $('.buffet-branch').hide();
        }

        swicth_branch_buffet();
    });

    if ($('[name="branch"]').length > 0 ) {
        setTimeout(function(){
            $('[name="branch"]').trigger('change')
        }, 1000)
    }

    $(document).on('click', '[name="hours"]', function(){
        $('.tooltip-hourse').show();
        return false;
    });

    $(document).on('click', 'body', function(){
        if ($('.tooltip-hourse').is(':visible')) {
            $('.tooltip-hourse').hide();
        }
    });

    $(document).on('click', '.item-timed:not(.disabled) span', function(){
        $('.item-timed').removeClass('uk-active');
        $(this).parent().addClass('uk-active');
        $('[name="hours"]').val($(this).parent().data('timed'));
    });

    $(document).on('change', '[name="date_book"]', function(){
        var $this = $(this);
        var branch_id = $('[name="branch"]').val()
        $('body').append(loading);
        $.request('onGetLockBooking', {
            data:{
                date: $this.val(),
                branch: branch_id
            },
            success: function(data) { 
                $('.popup-backdrop').remove();
                $('.item-timed').removeClass('uk-active disabled');
                $('[name="hours"]').val('');
                var e_message = $('[name="hours"]').parents('.form-element');
                e_message.find('label.error').remove();
                if (data.status == 'success') {
                    if (data.lock_time.length > 0) {
                        data.lock_time.forEach( function(element, index) {
                            $('.item-timed[data-timed="'+element+'"]').addClass('disabled');
                        });
                    }
                    if (data.lock_time_full) {
                        e_message.append('<label class="error lock_full">Xin lỗi Quý khách, chúng tôi đã hết bàn trống!</label>');
                    }
                }else{
                    e_message.append('<label class="error lock_full">Xin lỗi Quý khách, Vui lòng chọn ngày hiện tại hoặc tương lai!</label>');
                }
            },
            handleErrorMessage(message){
                $('.popup-backdrop').remove();
            }
        });
        return false;
    });

    $(document).on('click', '.js-clone-item .js-swicth-branch', function(){
        $('.js-clone-item .item').removeClass('uk-active');
        $(this).parents('.item').addClass('uk-active');
        var formBox = $(this).parents('.establishments-box');
        formBox.addClass('uk-hidden');
        formBox.next().removeClass('uk-hidden');
        swicth_branch_buffet();

        // return false;
    });

    if ($('.form-buffet-form').length > 0) {
        $.validator.addMethod(
            "email",
            function(value, element) {
                var re = new RegExp(/^[+a-zA-Z0-9._-]+[a-z]+[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
                return this.optional(element) || re.test(value);
            },
            'Email này không hợp lệ'
        );
        $('.form-buffet-form').validate({
            rules: {
                branch: {
                    required: true,
                },
                name: {
                    required: true,
                },
                phone: {
                    number: true,
                    required: true,
                    minlength:10,
                    maxlength:10
                },
                email: {
                    email: true,
                    required: true,
                },
                date_book: {
                    required: true,
                },
                hours: {
                    required: true,
                }
            },
            messages: {
                branch: {
                    required: "Vui lòng chọn chi nhánh nơi bạn muốn đặt bàn!!"
                },
                name: {
                    required: "Họ và tên không được để trống!"
                },
                phone: {
                    number: "Số điện thoại phải là chữ số!",
                    required: "Số điện thoại không được để trống!",
                    minlength: "Số điện thoại không đúng định dạng",
                    maxlength: "Số điện thoại không đúng định dạng"
                },
                email: {
                    required: "Vui lòng nhập email!",
                    email: "Địa chỉ email không hợp lệ!",
                },
                date_book: {
                    required: "Ngày đặt bàn không được để trống!"
                },
                hours: {
                    required: "Giờ đặt bàn không được để trống!"
                }
            },
            submitHandler: function(form) {
                $('body').append(loading);
                var modal = UIkit.modal('#message-modal');
                $(form).request('onHandleFormBook', { 
                    success: function(data) { 
                        $('.popup-backdrop').remove();
                        if (data.error == false) {
                            $(form).trigger("reset");
                            modal.find('.uk-modal-title').html('Đã gửi thông tin! Quý khách sẽ nhận được xác nhận đặt bàn qua email. Cảm ơn Quý khách');
                            modal.find('.modal-message').html('');
                        }else{
                            modal.find('.uk-modal-title').html('Thông báo');
                            modal.find('.modal-message').html(data.message);
                        }
                        modal.show();
                    } 
                }); 
                return false;
            }
        });
    }

    $(window).scroll(function() {
        if($(this).scrollTop() > 50) $('#goTop').stop().animate({ bottom: '10px' }, 200);
        else $('#goTop').stop().animate({ bottom: '-60px' }, 200);
    });
    $(document).ready(function() {
        $('#goTop, .goTop-page').click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0},500);
        });
    });

    $(document).on('click', '.establishments-list .item', function(){
        var mobile = screen.width > 996 ? false : true;
        if ( $(this).data('lat') && $(this).data('lng') && !mobile){
            var title = $(this).find('.item-name').text();

            $('#map').html('<a class="img-cover" href="'+$(this).data('lng')+'" target="_blank"><img src="'+$(this).data('lat')+'" alt="Maps"></a>');
            // var myLatlng = new google.maps.LatLng($(this).data('lat'), $(this).data('lng'));
            // marker.setPosition(myLatlng);
            // marker.setTitle(title);
            // infowindow.setContent(title)
            // map.setCenter(myLatlng);
        }
    });
});


function initMap() {
//     let position = { 
//         lat: 21.004817423325765, 
//         lng: 105.80464332484505
//     };
    let title = 'Buffet Poseidon!';
    var poseidon = document.getElementsByClassName('item uk-active')[0];
//     if (poseidon.dataset.lat) {
//         position.lat = parseFloat(poseidon.dataset.lat);
//     }
//     if (poseidon.dataset.lng) {
//         position.lng = parseFloat(poseidon.dataset.lng);
//     }
//     if (poseidon.firstElementChild.textContent) {
//         title = poseidon.firstElementChild.textContent;
//     }

//     window.map = new google.maps.Map(document.getElementById("map"), {
//         center: position,
//         zoom: 15,
//     });
  
//     window.marker = new google.maps.Marker({
//         // The below line is equivalent to writing:
//         position: position,
//         title: title,
//         map: map,
//     });

//     window.infowindow = new google.maps.InfoWindow({
//         content: title,
//     });

//     google.maps.event.addListener(marker, "click", () => {
//         infowindow.open(map, marker);
//     });

    $('#map').html('<a class="img-cover" href="'+poseidon.dataset.lng+'" target="_blank"><img src="'+poseidon.dataset.lat+'" alt="Maps"></a>');
}
if ( $('#map').length > 0 ) {
    initMap();
}
// window.initMap = initMap;
