$('#resetForm').on('click', function () {
    location.reload(true);
});
$('#armyPoint').on('change', function () {
    $(".onPoints").html($(this).val());
});

$('#factionSelect').on('change', function () {
    $(".factionNameResume").empty().append($(this).find("option:selected").text());
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
            ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'"></span>';
            ul += '</li>';
            $(".commandantNameResume").empty();
            $(".commandantNameResume").append(ul);
            //si cmd est NCU alors ajoute direct à attement
            if(individuInfo.typeIndividuId == 4)
                addNCU(individuInfo);

            $("#modalListCmd").modal('hide');
        });
});

$(document).on('click', '.btnAddUc', function () {
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).attr('id')},
    })
    .done(function( individuInfo ) {
        var random = Math.round(new Date().getTime() + (Math.random() * 100));
        var ul = '';
        ul += '<li><span class="col-xs-11">'+individuInfo.nom+'('+individuInfo.cout+')';
        ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'"></span></span></span>';
        ul += '<button id="attachFrom'+random+'" type="button" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="'+individuInfo.id+'">Ajouter un attachement</button>';
        ul += '</li>';

        $(".listCombatUnitNameResume").append(ul);
        $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
        $("#modalListUC").modal('hide');
    });
});

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
    ul += '<li><span class="col-xs-11">'+individuInfo.nom+'('+individuInfo.cout+')';
    ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'"></span></span></span>';
    ul += '</li>';
    $(".listNonCombatUnitNameResume").append(ul);
    $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
    $("#modalListNUC").modal('hide');
}

$(document).on('click', '.btnAddAttachment', function (e) {
    var idAttchBtnToReplace = $(this).data('idattchbtntoreplace');
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).attr('id')},
    })
    .done(function( individuInfo ) {
        var ul = '';
        ul += '<div class="col-xs-11 col-xs-offset-1" >avec '+individuInfo.nom+'('+individuInfo.cout+')';
        ul += '<span style="margin-left: 10px"><span class="glyphicon glyphicon-trash attchment" style="cursor: pointer" data-id="'+individuInfo.id+'"></span></span></div>';
        $("#"+idAttchBtnToReplace).replaceWith(ul);
        $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
        $("#modalListAttachment").modal('hide');
    });
});



$(document).on('click', '.listCombatUnitNameResume .glyphicon.glyphicon-trash, .listNonCombatUnitNameResume .glyphicon.glyphicon-trash, .commandantNameResume .glyphicon.glyphicon-trash', function () {
    var toDelete = $(this);
    var child = null;
    var isAttch = toDelete.hasClass('attchment');
    if(!isAttch)
        child = toDelete.parent().parent().parent().find('.glyphicon.glyphicon-trash.attchment').data('id');

    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).data('id'), idChild: child},
    })
    .done(function( msg ) {
        if(!isAttch)
            $(toDelete).closest("li").remove();
        else {
            var btn = '<button type="button" class="btn btn-primary btn-sm btnListAttchment" style="margin-left: 3.5em;" data-iducrattach="' + child + '">Ajouter un attachement</button>';
            $(toDelete).parent().parent().replaceWith(btn);
        }
        $(".pointResume").html(Number($(".pointResume").html()) - Number(msg.cout) - Number(msg.coutAttch));
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
        for(var individuInfo in msg) {
            var totalPoints = Number($(".pointResume").html()) + Number(msg[individuInfo].cout);
            ul += '<li>';
            if(msg[individuInfo].factionId == '3'){
                var neutralLimit = (Number($(".pointResume").html()) / Number($("#armyPoint").val()))*50;
                if(Number(msg[individuInfo].cout) > neutralLimit && $("#factionSelect option:selected").val() != 3)
                    ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">Les points de l\'armée non neutre ne peuvent pas dépasser 50% de neutralité.</span>';
            }
            if ((totalPoints > Number($("#armyPoint").val())))
                ul += '<span class="row alert alert-danger col-lg-12 col-xs-12" style="margin-left: 0">Le total des points ne peut pas dépasser la limite de taille de l\'armée.</span>';
            ul += '<span class="row">' + msg[individuInfo].nom + '<br>';
            if (selectId != '.listCmd')
                ul += msg[individuInfo].cout + ' points - ';
            ul += msg[individuInfo].typeIndividu;
            ul += '</span>';
            ul += '<span class="row"><image class="img-responsive col-xs-12" src="'+msg[individuInfo].pathVerso+'"></image></span>';
            ul += '<br><span class="row text-center"><button data-idattchbtntoreplace="'+idAttchBtnToReplace+'" type="button" class="btn btn-danger col-xs-12 ' + btnToAdd + '" id="' + msg[individuInfo].id + '" ';
            if((msg[individuInfo].isUnique &&  $('*[data-id="'+msg[individuInfo].id+'"]').length != 0 && msg[individuInfo].type != 1)  || (msg[individuInfo].type == 1 && $('.listCombatUnitNameResume').find('*[data-id="'+msg[individuInfo].id+'"]').length != 0))
                ul += ' disabled ';
            ul += ' >Ajouter</button></span>';
            ul += '</li><hr>';
        }


        $(selectId).empty();
        $(selectId).append(ul);
        $(modalId).modal('show');
    });
}








$(document).ready(function() {

    //$(".factionNameResume").empty().append($("#factionSelect option:selected").text());
    // $('#commandSelect').select2();
    // $('#combatUnit').select2();
    // $('#nonCombatUnit').select2();
});




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

