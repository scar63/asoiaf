$('#resetForm').on('click', function () {
    location.reload(true);
});
$('#armyPoint').on('change', function () {
    $(".onPoints").html($(this).val());
    checkIfOutOfScore();
});

$('#factionSelect').on('change', function () {
    var infoFactionSelect = '<input type="hidden" name="factionID" value="'+$(this).find("option:selected").val()+'"/>';
    $(".factionNameResume").empty().append($(this).find("option:selected").text()+infoFactionSelect);
    clearResume();
});

$('#btnListCmd').on('click', function () {
    if ($('#factionSelect').find("option:selected").val() == '')
        alert('Veuillez selectionner une faction');
    else
        getIndividus($('#factionSelect').find("option:selected").val(), 1, '.listCmd', '#modalListCmd', 'btnAddCmd');
});

$('#btnListUC').on('click', function () {
   if($('#factionSelect').find("option:selected").val() == '')
       alert('Veuillez selectionner une faction');
    else
        getIndividus($('#factionSelect').find("option:selected").val(), 2, '.listUC', '#modalListUC', 'btnAddUc');
});

$('#btnListNUC').on('click', function () {
    if($('#factionSelect').find("option:selected").val() == '')
        alert('Veuillez selectionner une faction');
    else
    getIndividus($('#factionSelect').find("option:selected").val(), 4, '.listNUC', '#modalListNUC', 'btnAddNUc');
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
            ul += '<li><span class="col-lg-10">'+individuInfo.nom+'('+individuInfo.cout+')</span> ';
            ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'">';
            ul +=  '<input type="hidden" name="cmdID" value="'+individuInfo.id+'"/>';
            ul +=  '</span>';
            ul += '</li>';
            $(".commandantNameResume").empty();
            $(".commandantNameResume").append(ul);

            //on check si y a pas un ncu-cmd qui traine
            if($(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').length != 0)
                $(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').closest("li").remove();

            //si cmd est NCU alors ajoute direct à attement
            if(individuInfo.typeIndividuId == 4)
                addNCU(individuInfo);

            $("#modalListCmd").modal('hide');
        });
});

$(document).on('click', '.btnAddUc', function () {
    addUC($(this).attr('id'));
});

function addUC(idUCToAdd)
{
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: idUCToAdd},
    })
        .done(function( individuInfo ) {
            var random = Math.round(new Date().getTime() + (Math.random() * 100));
            var ul = '';
            ul += '<li><span class="col-xs-11">'+individuInfo.nom+'(<span class="coutUc">'+individuInfo.cout+'</span>)';
            if(!individuInfo.isOnlySetWhenAttach)
                ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"></span>';
            ul +=  '<input type="hidden" name="ucID[]" value="'+individuInfo.id+'"/>';
            ul +=   '</span></span>';
            if(!individuInfo.isOnlySetWhenAttach)
                ul += '<button id="attachFrom'+random+'" type="button" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="'+individuInfo.id+'">Ajouter un attachement</button>';
            ul += '</li>';

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
    ul += '<li><span class="col-xs-11">'+individuInfo.nom+'(<span class="coutNUC">'+individuInfo.cout+'</span>)';
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
        ul += '<li><span class="col-lg-10">'+individuInfo.nom+'('+individuInfo.cout+')</span> ';
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
        ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'(<span class="coutAttach">'+individuInfo.cout+'</span>)';
        ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash attchment" style="cursor: pointer" data-id="'+individuInfo.id+'" data-realname="'+individuInfo.realName+'"></span></span>' +
            '<input type="hidden" name="nattchID[]" value="'+individuInfo.id+'_'+parent+'"></div>';

        if(individuInfo.hasAttachId != 0)
            addUC(individuInfo.hasAttachId);

        $("#"+idAttchBtnToReplace).replaceWith(ul);
        $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
        checkIfOutOfScore();
        $("#modalListAttachment").modal('hide');
    });
});



$(document).on('click', '.listCombatUnitNameResume .glyphicon.glyphicon-trash, .listNonCombatUnitNameResume .glyphicon.glyphicon-trash, .commandantNameResume .glyphicon.glyphicon-trash', function () {
    var toDelete = $(this);
    var child = null;
    var isAttch = toDelete.hasClass('attchment');
    var isNCnuCmd = toDelete.data('isncucmd');
    //si c'est pas un attch, on check si y a pas un enfant
    if(!isAttch)
        child = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash.attchment').data('id');
    else {
        child = toDelete.data('id');
        parent = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash').data('id');
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
                $(".listNonCombatUnitNameResume").find('[data-isncucmd="true"]').closest("li").remove();
            }
            else
                $(toDelete).closest("li").remove();

        }
        else {
            var random = Math.round(new Date().getTime() + (Math.random() * 100));
            var btn = '<button type="button" id="attachFrom'+random+'" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="' + parent + '">Ajouter un attachement</button>';
            $(toDelete).parent().parent().replaceWith(btn);
        }
        $(".pointResume").html(Number($(".pointResume").html()) - Number(msg.cout) - Number(msg.coutAttch));
        checkIfOutOfScore();
    });
});


function getIndividus(factionId, typeId, selectId, modalId, btnToAdd, idUCrattach = null, idAttchBtnToReplace=null)
{
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetListIndividus'),
        data: { faction: factionId, type: typeId, individuId: idUCrattach },
    })
    .done(function( msg ) {

        var ul = '';
        var ulDisabled = '';
        for(var individuInfo in msg) {

            if(msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length != 0 ) || (msg[individuInfo].realName != "" && $('*[data-realname="'+msg[individuInfo].realName+'"]').length != 0 ))
                ulDisabled += buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd);
            else
                ul += buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd, idUCrattach);
        }

        $(selectId).empty();
        $(selectId).append(ul += ulDisabled);
        $(modalId).modal('show');
    });
}


function buildLi(msg, individuInfo, selectId, typeId, idAttchBtnToReplace, btnToAdd, idUCrattach){

    var totalPoints = Number($(".pointResume").html()) + Number(msg[individuInfo].cout);

    var ul = '<li>';
    if(msg[individuInfo].factionId != '3' && typeId == "4" ){
        var coutNUC = 0;
         $('.coutNUC').each(function() {
             coutNUC += Number($(this).html());
         });
         var neutralLimit = ((Number(msg[individuInfo].cout) + coutNUC) / Number($("#armyPoint").val())) *100;
        if( neutralLimit > 50  && $("#factionSelect option:selected").val() != 3)
            ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">Les points de l\'armée non neutre ne peuvent pas dépasser 50% de neutralité.</span>';
    }
    if ((totalPoints > Number($("#armyPoint").val())))
        ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">Le total des points ne peut pas dépasser la limite de taille de l\'armée.</span>';
    ul += '<span class="row">' + msg[individuInfo].nom;
    ul += '<br>';
    if (selectId != '.listCmd')
        ul += msg[individuInfo].cout + ' points - ';
    ul += msg[individuInfo].typeIndividu;
    if(msg[individuInfo].type == 1)
        ul += '<span class="glyphicon glyphicon-king" style="margin-left: 5px"></span>';
    ul += '</span>';
    if(typeId == "1" || typeId == "3" || typeId == "4") {
        ul += '<span class="row"><image class="img-responsive col-xs-6 clearfix" src="'+msg[individuInfo].pathRecto+'"></image>';
        ul += '<image class="img-responsive col-xs-6" src="'+msg[individuInfo].pathVerso+'"></image></span>';
    }
    else
        ul += '<span class="row"><image class="img-responsive col-xs-12" src="'+msg[individuInfo].pathVerso+'"></image></span>';
    ul += '<br><span class="row text-center"><button data-idattchbtntoreplace="'+idAttchBtnToReplace+'" type="button" class="btn btn-danger col-xs-12 ' + btnToAdd + '" id="' + msg[individuInfo].id + '" data-parent="'+idUCrattach+'"';
    //if((msg[individuInfo].isUnique &&  $('*[data-id="'+msg[individuInfo].id+'"]').length != 0 && msg[individuInfo].type != 1)  || (msg[individuInfo].type == 1 && $('.listCombatUnitNameResume').find('*[data-id="'+msg[individuInfo].id+'"]').length != 0))
    //pas un cas spécial  ?
    if(msg[individuInfo].isUnique &&  ($('*[data-id="'+msg[individuInfo].id+'"]').length != 0 ) || (msg[individuInfo].realName != "" && $('*[data-realname="'+msg[individuInfo].realName+'"]').length != 0 ))
        ul += ' disabled ';

    ul += ' >Ajouter</button></span>';
    ul += '</li><hr>';

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
    $('.coutUc').each(function() {
        countPointUC += Number($(this).html());
    });

    $('.coutAttach').each(function() {
        countPointAttch += Number($(this).html());
    });

     $('.coutNUC').each(function() {
         coutNUC += Number($(this).html());
    });


    var neutralLimit = (coutNUC / Number($("#armyPoint").val())) *100;
    if( neutralLimit > 50  && $("#factionSelect option:selected").val() != 3)
        $('#limitOutNCU').removeClass('hidden');
    else if(!$('#limitOutNCU').hasClass('hidden'))
        $('#limitOutNCU').addClass('hidden');
}




$(document).ready(function() {

    //$(".factionNameResume").empty().append($("#factionSelect option:selected").text());
    // $('#commandSelect').select2();
    // $('#commandSelect').select2();
    // $('#nonCombatUnit').select2();
});

function clearResume()
{
    $(".commandantNameResume").empty();
    $(".pointResume").html("0");
    $(".listCombatUnitNameResume").empty();
    $(".listNonCombatUnitNameResume").empty();
}


/*****************DROP DOWN SELECT***********************************************************************/





/*****************DROP DOWN SELECT**********************************************************************

$('#factionSelect').on('change', function () {


    $(".factionNameResume").empty().append($(this).find("option:selected").text());
    $(".commandantNameResume").empty();
    // $(".listCombatUnitNameResume").remove();

    getIndividus('ajaxGetListCommandant', $(this).find("option:selected").val(), 1, '#commandSelect');

    getIndividus('ajaxGetListUC', $(this).find("option:selected").val(), 2, '#combatUnit');

    getIndividus('ajaxGetListNUC', $(this).find("option:selected").val(), 4, '#nonCombatUnit');
});

$('#commandSelect').on('change', function () {
    $('.commandantNameResume').empty().append($(this).find("option:selected").text());

});


$('#combatUnit').on('change', function () {
    if($('#combatUnit option:selected').attr('data-isunique')) {
        $('#combatUnit option:selected').prop('disabled', true);
    }

    $(this).select2();
    $(".nothingUC").hide();

    var typeIndividu = $(this).find("option:selected").data('typeunite');
    var toAdd = '<li class="card" data-cout ="'+$(this).find("option:selected").data('cout')+'" ' +
        'data-idselect ="'+$(this).find("option:selected").val()+'" data-typeindividu="'+typeIndividu+'">'+
        $(this).find("option:selected").text()+'<span class="glyphicon glyphicon-remove uc"></span>' +
        '<select class="form-control attachmentUnit" >';

    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetListAttachement'),
        data: {idTypeIndividu: typeIndividu},
        async:false
    })
        .done(function (msg) {
            toAdd += msg;

        });

    toAdd += '</select></li>';

    $(".listCombatUnitNameResume").append(toAdd);
    $('.attachmentUnit').select2();
    $(".pointResume").html(Number($(".pointResume").html()) + Number($(this).find('option:selected').attr('data-cout')));

});

$('#nonCombatUnit').on('change', function () {
    if($('#nonCombatUnit option:selected').attr('data-isunique')) {
        $('#nonCombatUnit option:selected').prop('disabled', true);
    }

    $(this).select2();
    $(".nothingNUC").hide();

    var toAdd = '<li class="card" data-cout ="'+$(this).find("option:selected").data('cout')+'" data-idselect ="'+$(this).find("option:selected").val()+'">'+
        $(this).find("option:selected").text()+'<span class="glyphicon glyphicon-remove nuc"></span></li>';

    $(".listNonCombatUnitNameResume").append(toAdd);

    $(".pointResume").html(Number($(".pointResume").html()) + Number($(this).find('option:selected').attr('data-cout')));
});

$(document).on('change', '.attachmentUnit', function () {

    if($('.attachmentUnit option:selected').attr('data-isunique')) {
        $('.attachmentUnit option:selected').prop('disabled', true);
    }
    $(this).select2();

    $(this).parent('li').append('<br><span class="attchSelect" style="margin-left: 20px;margin-top: 20px" data-cout ="'+$(this).find("option:selected").data('cout')+'" data-idselect ="'+$(this).find("option:selected").val()+'">'+$(this).find("option:selected").text()+'<span class="glyphicon glyphicon-remove attch"></span></span>');

    $(".pointResume").html(Number($(".pointResume").html()) + Number($(this).find('option:selected').attr('data-cout')));
});
 */

/*****************REMOVE***********************************************************************/
/*
$(document).on('click', '.listCombatUnitNameResume .glyphicon-remove.uc', function() {
    $("#combatUnit").find('option[value="'+$(this).parent('li').data('idselect')+'"]').prop('disabled', false);
    $("#combatUnit").select2();
    var count = Number($(this).parent('li').attr('data-cout'));
    $(this).parent('li').find('.attchSelect').each(function() {
        count += Number($(this).attr('data-cout'));
    });
    $(this).parent('li').remove();
    if ( $('.listCombatUnitNameResume li').length == 1 )
        $(".nothingUC").show();

    $(".pointResume").html(Number($(".pointResume").html()) - Number(count));
});

$(document).on('click', '.listNonCombatUnitNameResume .glyphicon-remove.nuc', function() {
    $("#nonCombatUnit").find('option[value="'+$(this).parent('li').data('idselect')+'"]').prop('disabled', false);
    $("#nonCombatUnit").select2();
    var count = Number($(this).parent('li').attr('data-cout'));
    $(this).parent('li').remove();
    if ( $('.listNonCombatUnitNameResume li').length == 1 )
        $(".nothingNUC").show();
    //var count = Number($(this).parent('li').attr('data-cout'));

    $(".pointResume").html(Number($(".pointResume").html()) - Number(count));
});


$(document).on('click', '.listCombatUnitNameResume .glyphicon-remove.attch', function() {
    $(this).parent('li').find(".attachmentUnit").find('option[value="'+$(this).data('idselect')+'"]').prop('disabled', false);
    $(this).parent('span').remove();
    $(this).parent('li').find(".attachmentUnit").select2();
    console.log(Number($(this).parent('span').attr('data-cout')));
    $(".pointResume").html(Number($(".pointResume").html()) - Number($(this).parent('span').attr('data-cout')));
});
*/

