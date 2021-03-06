$('#resetForm').on('click', function () {
    $('#factionSelect  option[value=""]').prop("selected", true);
    location.reload();
});
$('#armyPoint').on('change', function () {
    $(".onPoints").html($(this).val());
    checkIfOutOfScore();
});

$('#factionSelect').on('change', function () {
    var factionId = $(this).find("option:selected").val();
    var infoFactionSelect = '<input type="hidden" name="factionID" value="'+factionId+'"/>';
    $(".factionNameResume").empty().append($(this).find("option:selected").text()+infoFactionSelect);

    //si faciotn szelect == lanister ou stark alrs on check si les individues on un cas specila attachUnitAdverse) si c'sety le ca on le set
    if(factionId == 2 || factionId == 1) {
        //on peuple les individus attch à l'adversaire
        $.ajax({
            method: "POST",
            url: Routing.generate('ajaxGetAdversInclude'),
            data: { factionID: factionId},
        })
            .done(function( individusInfo ) {
                $(".listNameAdversInclude").empty();
                var ul = '';
                for(var [key, individuInfo]  of Object.entries(individusInfo)) {
                    ul += '<input class="coutAdversInclude" type="checkbox" value="' + individuInfo.cout + '">&nbsp;&nbsp;'+ TWIG.RESUME_INCLUDE_HOSTAGE+'<span class="nameAdversInclude"> "' + individuInfo.nom + '&nbsp;(' + individuInfo.cout + ')"</span>';
                }
                $(".listNameAdversInclude").append(ul);
                $(".listNameAdversInclude").show();
            });
    }
    else
        $(".listNameAdversInclude").hide();
    clearResume();
});

$(document).on('click', '.coutAdversInclude', function () {
    if($(this).prop('checked'))
        $(".pointResume").html(Number($(".pointResume").html()) + Number($(this).val()));
    else
        $(".pointResume").html(Number($(".pointResume").html()) - Number($(this).val()));
});

$('#btnListCmd').on('click', function () {
    if ($('#factionSelect').find("option:selected").val() == '')
        alert(TWIG.ALERT_SELECT_FACTION);
    else
        getIndividus($('#factionSelect').find("option:selected").val(), 1, '.listCmd', '#modalListCmd', 'btnAddCmd');
});

$('#btnListUC').on('click', function () {
   if($('#factionSelect').find("option:selected").val() == '')
       alert(TWIG.ALERT_SELECT_FACTION);
    else
        getIndividus($('#factionSelect').find("option:selected").val(), 2, '.listUC', '#modalListUC', 'btnAddUc');
});

$('#btnListNUC').on('click', function () {
    if($('#factionSelect').find("option:selected").val() == '')
        alert(TWIG.ALERT_SELECT_FACTION);
    else
    getIndividus($('#factionSelect').find("option:selected").val(), 4, '.listNUC', '#modalListNUC', 'btnAddNUc');
});

$('#btnlistCartesTactiques').on('click', function () {
    if($('#factionSelect').find("option:selected").val() == '')
        alert(TWIG.ALERT_SELECT_FACTION);
    else
    {
        //on recup l'id du cmd
        var idCmd = $('input[name=cmdID]').val();
        //on recup les id des uc et leurs attch
        var idsUC = $("input[name='ucID[]']").map(function(){return $(this).val();}).get();
        //on recup les id des ncu et leurs attch
        var idsNUC = $("input[name='nucID[]']").map(function(){return $(this).val();}).get();
        var nattchID = $("input[name='nattchID[]']").map(function(){ return $(this).val().split("_")[0];}).get();
        var idFaction = $('#factionSelect').find("option:selected").val();

        $.ajax({
            method: "POST",
            url: Routing.generate('ajaxGetLisTacticalCards'),
            data: { idFaction: idFaction,idCmd: idCmd, isTogetTacticalCards: true  },
            // data: { idFaction: idFaction,idCmd: idCmd, idsUC: idsUC, idsNUC: idsNUC, nattchID: nattchID, isTogetTacticalCards: true  },
        })
        .done(function( msg ) {

            var ul = '';
            var ulDisabled = '';
            for(var individuInfo in msg) {
                //si individu est général et select en cmd peut être add en attch
                    ul += buildLiTactilcalCards(msg, individuInfo, '.listTacticalCards');
            }

            $('.listTacticalCards').empty();
            $('.listTacticalCards').append(ul += ulDisabled);
            $('#modalListTacticalCards').modal('show');
        });
    }
});

$(document).on('click', '.btnListAttchment', function () {

    getIndividus($('#factionSelect').find("option:selected").val(), 3, '.listAttachment', '#modalListAttachment', 'btnAddAttachment', $(this).data('iducrattach'),  $(this).attr('id'));
});


$(document).on('click', '.btnAddCmd', function () {
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).attr('id')},
    })
        .done(function( individuInfo ) {
            var ul = '';
            ul += '<li><span class="col-lg-10">'+individuInfo.nom+'&nbsp;('+individuInfo.cout+')</span> ';
            ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'">';
            ul +=  '<input type="hidden" name="cmdID" value="'+individuInfo.id+'"/>';
            ul +=  '</span>';
            ul += '</li>';
            $(".commandantNameResume").empty();
            $(".commandantNameResume").append(ul);

            //on check si y a pas un ncu-cmd qui traine
            if($(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').length != 0)
                $(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').closest("li").remove();

            if($(".listCombatUnitNameResume").find('[data-isncucmd="true"]').length != 0) {
                var random = Math.round(new Date().getTime() + (Math.random() * 100));
                $(".listCombatUnitNameResume").find('[data-isncucmd="true"]').closest("div").replaceWith('<button id="attachFrom'+random+'" type="button" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="'+individuInfo.id+'">'+TWIG.BUTTON_ADD_ATTCHEMENT+'</button>');
            }

            //si cmd est NCU alors ajoute direct à attement
            if(individuInfo.typeIndividuId == 4)
                addNCU(individuInfo);

            $("#modalListCmd").modal('hide');
        });
});

$(document).on('click', '.btnAddUc', function () {
    addUC($(this).attr('id'));
});

$(document).on('click', '#copyToClipboard', function () {

    $.ajax({
        method: "POST",
        url: Routing.generate('copyToClipboard'),
        async: false,
        data: {
            armyName:  $('#armyName').val(),
            faction: $("#factionSelect option:selected").html().trim(),
            points: $('.pointResume').html()+'/'+$('.onPoints').html(),
            neutral: $('.pointNeutralie').html(),
            idCmd: $("input[name='cmdID']").val(),
            idsUC: $("input[name='ucID[]']").map(function () {
                return $(this).val();
            }).get(),
            idsNUC: $("input[name='nucID[]']").map(function () {
                return $(this).val();
            }).get(),
            nattchID: $("input[name='nattchID[]']").map(function () {
                return $(this).val();
            }).get()
        }
    })
    .done(function( rslt ) {
        var $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val(rslt.replace(/<br\s*\/?>/gi, "\r\n")).select();
        document.execCommand("copy");
        $temp.remove();
    });

});

function addUC(idUCToAdd, idParentToAttach = null)
{
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: idUCToAdd},
    })
        .done(function( individuInfo ) {
            var random = Math.round(new Date().getTime() + (Math.random() * 100));
            var ul = '';
            if(idParentToAttach !== null) {
                if(individuInfo.faction == 3)
                    ul += '<div class="col-xs-11" style="margin-left: -4.2em"><li>' + individuInfo.nom + '&nbsp;(<span class="coutAttach coutNeutral">' + individuInfo.cout + '</span>)';
                else
                    ul += '<div class="col-xs-11" style="margin-left: -4.2em"><li>' + individuInfo.nom + '&nbsp;(<span class="coutAttach">' + individuInfo.cout + '</span>)';
                ul += '<span style="margin-left: 10px">';
                if(individuInfo.isOnlySetWhenAttach)
                    ul += '<span class="glyphicon glyphicon-trash attchment isOnlySetWhenAttach"'
                else
                    ul += '<span class="glyphicon glyphicon-trash attchment"'
                ul+= '" style="cursor: pointer" data-id="' + individuInfo.id + '" data-realname="' + individuInfo.realName + '"';
                if (individuInfo.typeId == 1)
                    ul += 'data-isncucmd="true"';
                ul += '></span></span>' +
                    '<input type="hidden" name="nattchID[]" value="' + individuInfo.id + '_' + idParentToAttach + '"></li></div>';
            }
            else
            {
                if(individuInfo.faction == 3)
                    ul += '<li><span class="col-xs-11">'+individuInfo.nom+'&nbsp;(<span class="coutUc coutNeutral">'+individuInfo.cout+'</span>)';
                else
                    ul += '<li><span class="col-xs-11">'+individuInfo.nom+'&nbsp;(<span class="coutUc">'+individuInfo.cout+'</span>)';
                 if(individuInfo.isOnlySetWhenCmdSelect)
                     ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-special="mustBeDelete" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"></span>';
                 else
                    ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-special="'+individuInfo.special+'" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"></span>';
                ul +=  '<input type="hidden" name="ucID[]" value="'+individuInfo.id+'"/>';
                ul +=   '</span></span>';
            }

            if(!individuInfo.isOnlySetWhenAttach && !individuInfo.isOnlySetWhenCmdSelect)
                ul += '<button id="attachFrom'+random+'" type="button" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="'+individuInfo.id+'">'+TWIG.BUTTON_ADD_ATTCHEMENT+'</button>';

            if(individuInfo.isOnlySetWhenCmdSelect)
            {
                var idParent = individuInfo.id;
                $.ajax({
                    method: "POST",
                    url: Routing.generate('ajaxGetInfoIndividu'),
                    data: { id: individuInfo.hasAttachId},
                    async:false
                })
                .done(function( individuInfo ) {
                    if(individuInfo.faction == 3)
                        ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'&nbsp;(<span class="coutAttach coutNeutral">'+individuInfo.cout+'</span>)';
                    else
                        ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'&nbsp;(<span class="coutAttach">'+individuInfo.cout+'</span>)';
                    ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash attchment" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"';
                    // if(individuInfo.typeId == 1)
                        ul += 'data-isncucmd="true"';
                    ul += '></span></span>' +
                    '<input type="hidden" name="nattchID[]" value="'+individuInfo.id+'_'+idParent+'"></div>';

                    $(".glyphicon.glyphicon-trash[data-id='"+individuInfo.id+"']").attr('data-isncucmd', 'true');
               });
            }
            ul += '</li>';

            if(idParentToAttach !== null)
                $('.listCombatUnitNameResume').find('[data-id="'+idParentToAttach+'"]').closest('div').append(ul);
            else
                $(".listCombatUnitNameResume").append(ul);
            $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
            checkIfOutOfScore();
            $("#modalListUC").modal('hide');
        });
}


$(document).on('click', '.btnAddNUc', function () {
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).attr('id')},
    })
    .done(function( individuInfo ) {
        addNCU(individuInfo);
    });
});


function addNCU(individuInfo)
{
    var ul = '';
    if(individuInfo.faction == 3)
        ul += '<li><span class="col-xs-11">'+individuInfo.nom+'&nbsp;(<span class="coutNeutral coutNUC">'+individuInfo.cout+'</span>)';
    else
        ul += '<li><span class="col-xs-11">'+individuInfo.nom+'&nbsp;(<span class="coutNUC">'+individuInfo.cout+'</span>)';
    ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"';
    if(individuInfo.typeId == 1)
        ul += 'data-isncucmd="true"';
    ul += '></span></span></span>';
    ul +=  '<input type="hidden" name="nucID[]" value="'+individuInfo.id+'"/>';
    ul += '</li>';
    $(".listNonCombatUnitNameResume").append(ul);
    $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
    checkIfOutOfScore();
    //si NCU est cmd alors ajoute direct à cmd
    if(individuInfo.typeId == 1)
    {
        var ul = '';
        ul += '<li><span class="col-lg-10">'+individuInfo.nom+'&nbsp;('+individuInfo.cout+')</span> ';
        ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-isncucmd="true" data-realname="'+individuInfo.realName+'"></span>';
        ul +=  '<input type="hidden" name="cmdID"  value="'+individuInfo.id+'"/>';
        ul += '</li>';
        $(".commandantNameResume").empty();
        $(".commandantNameResume").append(ul);
    }
    $("#modalListNUC").modal('hide');
}

$(document).on('click', '.btnAddAttachment', function (e) {
    var idAttchBtnToReplace = $(this).data('idattchbtntoreplace');
    var parent = $(this).data('parent');
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).attr('id')},
    })
    .done(function( individuInfo ) {
        var ul = '';
        if(individuInfo.faction == 3)
            ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'&nbsp;(<span class="coutAttach coutNeutral">'+individuInfo.cout+'</span>)';
        else
            ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'&nbsp;(<span class="coutAttach">'+individuInfo.cout+'</span>)';
        ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash attchment" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"';
        if(individuInfo.typeId == 1)
            ul += 'data-isncucmd="true"';
        ul += '></span></span>' +
            '<input type="hidden" name="nattchID[]" value="'+individuInfo.id+'_'+parent+'"></div>';

        if(individuInfo.hasAttachId != 0)
            addUC(individuInfo.hasAttachId, individuInfo.id);

        $("#"+idAttchBtnToReplace).replaceWith(ul);
        $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
        checkIfOutOfScore();
        //si NCU est cmd alors ajoute direct à cmd
        if(individuInfo.typeId == 1)
        {
            var ul = '';
            ul += '<li><span class="col-lg-10">'+individuInfo.nom+'('+individuInfo.cout+')</span> ';
            ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-isncucmd="true" data-realname="'+individuInfo.realName+'"></span>';
            ul +=  '<input type="hidden" name="cmdID"  value="'+individuInfo.id+'"/>';
            ul += '</li>';
            $(".commandantNameResume").empty();
            $(".commandantNameResume").append(ul);
        }
        $("#modalListAttachment").modal('hide');
    });
});



$(document).on('click', '.listCombatUnitNameResume .glyphicon.glyphicon-trash, .listNonCombatUnitNameResume .glyphicon.glyphicon-trash, .commandantNameResume .glyphicon.glyphicon-trash', function () {
    var toDelete = $(this);
    var child = null;
    var isAttch = toDelete.hasClass('attchment');
    var isOnlySetWhenAttach = toDelete.hasClass('isOnlySetWhenAttach');
    var isNCnuCmd = toDelete.data('isncucmd');
    //si c'est pas un attch, on check si y a pas un enfant
    if(!isAttch)
        child = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash.attchment').data('id');
    else {
        child = toDelete.data('id');
        parent = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash').data('id');
        special = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash').data('special');
    }

    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).data('id'), idChild: child},
    })
    .done(function( msg ) {
        if(!isAttch)
        {
            //si ncu et command on doit doit delete le cmd et le ncu
            if(isNCnuCmd){
               $(".commandantNameResume").find('[data-isncucmd="true"]').closest("li").remove();

                var idFirst = $(".listCombatUnitNameResume").find('[data-isncucmd="true"]').parent().parent().find('input').first().val();
                if(idFirst) {
                    var res = idFirst.split("_");
                    var random = Math.round(new Date().getTime() + (Math.random() * 100));
                    var btn = '<button type="button" id="attachFrom' + random + '" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="' + res[1] + '">'+TWIG.BUTTON_ADD_ATTCHEMENT+'</button>';
                    $(".listCombatUnitNameResume").find('[data-isncucmd="true"]').closest("div").replaceWith(btn);
                }

                $(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').closest("li").remove();
            }
            else
                $(toDelete).closest("li").remove();

        }
        else {
            if(!isOnlySetWhenAttach) {
                if(isNCnuCmd && special == 'mustBeDelete')
                {
                    toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash').parent().parent().remove();

                    $(toDelete).parent().parent().remove();

                }
                else
                {
                    var random = Math.round(new Date().getTime() + (Math.random() * 100));
                    var btn = '<button type="button" id="attachFrom' + random + '" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="' + parent + '">'+TWIG.BUTTON_ADD_ATTCHEMENT+'</button>';
                    $(toDelete).parent().parent().replaceWith(btn);
                }
            }
            else
                $(toDelete).parent().parent().remove();
        }
        $(".pointResume").html(Number($(".pointResume").html()) - Number(msg.cout) - Number(msg.coutAttch));
        checkIfOutOfScore();
    });
});


function getIndividus(factionId, typeId, selectId, modalId, btnToAdd, idUCrattach = null, idAttchBtnToReplace=null)
{
    var idCmd = null;
    if(typeof $('.commandantNameResume').find('.glyphicon.glyphicon-trash').data('id') !== 'undefined')
        idCmd = $('.commandantNameResume').find('.glyphicon.glyphicon-trash').data('id');

    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetListIndividus'),
        data: { faction: factionId, type: typeId, individuId: idUCrattach, idCmd: idCmd, '_locale': $('.languageChoose').val() },//attention arg !!idCmd: idCmd
    })
    .done(function( msg ) {

        var ul = '';
        var ulDisabled = '';
        for(var individuInfo in msg) {
            //si individu est général et select en cmd peut être add en attch
            // if((msg[individuInfo].type == 1  && msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length == 1 )) || (msg[individuInfo].libelleSpecial == 'processByTwo' && $('*[data-id="'+msg[individuInfo].id+'"]').length < 2 ))
            if((msg[individuInfo].type == 1  && msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length == 1 )) || (msg[individuInfo].libelleSpecial == 'processByTwo' ))
                ul += buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd, idUCrattach);
            else if((msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length == 0 )) || !msg[individuInfo].isUnique)
                ul += buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd, idUCrattach);
            else if(msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length != 0 ))
                ulDisabled += buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd);
        }
        $(selectId).empty();
        ul += ulDisabled;
        $(selectId).append(ul);
        sortList(modalId),
        $('.searchInModal').val('');
        $(modalId).modal('show');
    });
}


function buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd, idUCrattach){

    var totalPoints = Number($(".pointResume").html()) + Number(msg[individuInfo].cout);

    var ul = '<li>';
    var countPointUC = 0;
    var countPointAttch = 0;
    var coutNUC = 0;
    var coutNeutral = 0;
    $('.coutUc').each(function() {
        countPointUC += Number($(this).html());
    });
    $('.coutAttach').each(function() {
        countPointAttch += Number($(this).html());
    });
    $('.coutNUC').each(function() {
        coutNUC += Number($(this).html());
    });
    $('.coutNeutral').each(function() {
        coutNeutral += Number($(this).html());
    });
    var coutNeutral = 0;
    $('.coutNeutral').each(function() {
    coutNeutral += Number($(this).html());
    });

    // var neutralLimit = ((Number(msg[individuInfo].cout) + coutNeutral) / totalPoints)  *100;
    var on = Number($(".onPoints").html());
    var neutralLimit = (coutNeutral / on)  *100;
    if($(".pointResume").html() != 0 && neutralLimit > 50  && $("#factionSelect option:selected").val() != 3 && msg[individuInfo].faction == 3)
        ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">'+TWIG.ALERT_NEUTRAL_POINTS+'</span>';

    // if (msg[individuInfo].libelleSpecial == 'processByTwo' && !($('*[data-id="'+msg[individuInfo].id+'"]').length % 2) )
    //     ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">'+TWIG.ALERT_FF_RAIDERS+'</span>';
        // ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">'+msg[individuInfo].nom+' ne peuvent être alignés que par paires.</span>';
    if ((totalPoints > Number($("#armyPoint").val())))
        ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">'+TWIG.ALERT_POINT_CAN_EXCEED+'</span>';
    ul += '<span class="row">' + msg[individuInfo].nom;
    ul += '<br>';
    if (selectId != '.listCmd')
        ul += msg[individuInfo].cout + ' '+TWIG.MODAL_POINTS+' - ';
    ul += msg[individuInfo].typeIndividu;
    if(msg[individuInfo].type == 1)
        ul += '<span style="margin-left: 5px"><img src="/asoiaf/web/bundles/app/images/sigle-commandant.png"></span>';
    ul += '</span>';
    if(typeId == "1" || typeId == "3" || typeId == "4") {
        ul += '<span class="row"><img class="img-responsive col-xs-6 clearfix" src="'+msg[individuInfo].pathRecto+'">';
        ul += '<img class="img-responsive col-xs-6" src="'+msg[individuInfo].pathVerso+'"></span>';
        if(typeId == "1") {
            ul += '<span class="row"><img class="img-responsive col-xs-4" src="' + msg[individuInfo].pathTactilCardFirst + '">';
            ul += '<img class="img-responsive col-xs-4" src="' + msg[individuInfo].pathTactilCardSecond + '">';
            ul += '<img class="img-responsive col-xs-4" src="' + msg[individuInfo].pathTactilCardThird + '"></span>';
        }
    }
    else
        ul += '<span class="row"><img class="img-responsive col-xs-12" src="'+msg[individuInfo].pathVerso+'"></span>';
    ul += '<br><span class="row text-center"><button data-idattchbtntoreplace="'+idAttchBtnToReplace+'" type="button" class="btn btn-danger col-xs-12 ' + btnToAdd + '" id="' + msg[individuInfo].id + '" data-parent="'+idUCrattach+'"';
    //if((msg[individuInfo].isUnique &&  $('*[data-id="'+msg[individuInfo].id+'"]').length != 0 && msg[individuInfo].type != 1)  || (msg[individuInfo].type == 1 && $('.listCombatUnitNameResume').find('*[data-id="'+msg[individuInfo].id+'"]').length != 0))
    //pas un cas spécial  ?
    //(msg[individuInfo].type != 1) &&
    if(msg[individuInfo].isOnlySetWhenCmdSelect && msg[individuInfo].hasAttachId != $('input[name=cmdID]').val() )
        ul += ' disabled ';
    else if(msg[individuInfo].type == 1 &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length >= 2)) //cmd peut être set en attch
        ul += ' disabled ';
    else if(msg[individuInfo].type != 1)
    {
         if(typeId != 1 && (msg[individuInfo].libelleSpecial != 'processByTwo') && (msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length != 0 ) || (msg[individuInfo].isUnique && msg[individuInfo].realName != "" && $('*[data-realname="'+msg[individuInfo].realName+'"]').length != 0 )))
         // if(typeId != 1 && (msg[individuInfo].libelleSpecial != 'processByTwo') && (msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length != 0 )))
            ul += ' disabled ';

        if(typeId != 1 && msg[individuInfo].type == 1 && msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length > 1 ))
            ul += ' disabled ';

        // if(msg[individuInfo].libelleSpecial == 'processByTwo'  &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length >= 2 ))
        //     ul += ' disabled ';
    }
    else if(btnToAdd = 'btnAddCmd' && $('.commandantNameResume').html() != "")
        ul += ' disabled ';

        ul += ' >'+TWIG.BUTTON_ADD+'</button></span>';
    ul += '</li>';

    return ul;
}

/**
 *
 * @param msg
 * @param individuInfo
 * @param selectId
 * @returns {string}
 */
function buildLiTactilcalCards(msg, individuInfo, selectId){

    var ul = '<li>';
    ul += '<br><span class="row">';

    var mustHr = false;
    if(typeof msg[individuInfo]['tacticalCards'] !== 'undefined' && msg[individuInfo]['tacticalCards'] !== 'undefined'.length != 0){
        for (var pathCard in msg[individuInfo]['tacticalCards']) {
            if (msg[individuInfo]['tacticalCards'][pathCard].pathFaction != '') {
                mustHr = true;
                ul += '<img class="img-responsive col-xs-4 clearfix" src="' + msg[individuInfo]['tacticalCards'][pathCard].pathFaction + '">';
            }
        }
    }
    else{
        if(typeof msg[individuInfo] !== 'undefined' &&typeof msg[individuInfo].pathTactilCardFirst  !== 'undefined' && msg[individuInfo].pathTactilCardFirst != "") {
            mustHr = true;
            ul += '<img class="img-responsive col-xs-4 clearfix '+individuInfo+'" src="' + msg[individuInfo].pathTactilCardFirst + '">';
        }
        if(typeof msg[individuInfo].pathTactilCardSecond  !== 'undefined' &&  msg[individuInfo].pathTactilCardSecond != "") {
            mustHr = true;
            ul += '<img class="img-responsive col-xs-4 clearfix" src="' + msg[individuInfo].pathTactilCardSecond + '">';
        }
        if(typeof msg[individuInfo].pathTactilCardFirst  !== 'undefined' &&  msg[individuInfo].pathTactilCardFirst != "") {
            mustHr = true;
            ul += '<img class="img-responsive col-xs-4 clearfix" src="' + msg[individuInfo].pathTactilCardThird + '">';
        }
    }


    ul += '</span>';
    ul += '</li>';
    if(mustHr)
        ul += '<hr>';

    return ul;
}


function checkIfOutOfScore(){
    var pointresume = Number($(".pointResume").html());
    var on = Number($(".onPoints").html());

    if(pointresume > on)
        $('#limitOut').removeClass('hidden');
    else if(!$('#limitOut').hasClass('hidden'))
            $('#limitOut').addClass('hidden');


    var countPointUC = 0;
    var countPointAttch = 0;
    var coutNUC = 0;
    var coutNeutral = 0;
    $('.coutUc').each(function() {
        countPointUC += Number($(this).html());
    });

    $('.coutAttach').each(function() {
        countPointAttch += Number($(this).html());
    });

     $('.coutNUC').each(function() {
         coutNUC += Number($(this).html());
    });

    $('.coutNeutral').each(function() {
        coutNeutral += Number($(this).html());
    });

    // var neutralLimit = (((coutNeutral - pointresume ) / (pointresume)) +1)  *100;
    var neutralLimit = (coutNeutral / on)  *100;
    if(($(".pointResume").html() != 0 && neutralLimit > 50  && $("#factionSelect option:selected").val() != 3))
        $('#limitOutNCU').removeClass('hidden');
    else if(!$('#limitOutNCU').hasClass('hidden'))
        $('#limitOutNCU').addClass('hidden');



    if($('.listCombatUnitNameResume').find("*[data-special='processByTwo']").length%2 != 0)
        $('#processByTwo').removeClass('hidden');
    else if(!$('#processByTwo').hasClass('hidden'))
        $('#processByTwo').addClass('hidden');

    $(".pointResume").html(countPointUC + countPointAttch + coutNUC);

    if(coutNeutral ==  Number($(".pointResume").html()) && Number($(".pointResume").html()) != 0 && (countPointUC + countPointAttch + coutNUC) == 0)
        $(".pointNeutralie").html(coutNeutral + ' (100%)');
    else if(Number($(".pointResume").html()) == 0 || coutNeutral == 0)
        $(".pointNeutralie").html(coutNeutral);
    else
        $(".pointNeutralie").html(coutNeutral + ' (' + neutralLimit.toFixed(1) + '%)');
}




$(document).ready(function() {
    $("#armyPoint").val('40');
    $(".onPoints").html('40');
    //$(".factionNameResume").empty().append($("#factionSelect option:selected").text());
    // $('#commandSelect').select2();
    // $('#commandSelect').select2();
    // $('#nonCombatUnit').select2();
});

function clearResume()
{

    $(".commandantNameResume").empty();
    $(".pointResume").html("0");
    $(".pointNeutralie").empty();
    $(".listCombatUnitNameResume").empty();
    $(".listNonCombatUnitNameResume").empty();
}

function searchModal(toExplote) {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search'+toExplote);
    filter = input.value.toUpperCase();
    ul = document.getElementById("list"+toExplote);
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function sortList(modalId) {
    var listTmp, list, i, switching, b, shouldSwitch;
    listTmp = document.getElementById(modalId.replace('#', ''));
    list = listTmp.querySelector('ul');
    switching = true;
    while (switching) {
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            shouldSwitch = false;
            if (b[i].querySelector('button').hasAttribute('disabled') == true && b[i + 1].querySelector('button').hasAttribute('disabled') == false) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}