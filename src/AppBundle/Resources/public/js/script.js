$('#btnListCmd').on('click', function () {
    if($('#factionSelect').find("option:selected").val() == '')
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
            ul += '</li>'
            ul += '</ul>';
            $(".commandantNameResume").empty();
            $(".commandantNameResume").append(ul);
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
        var ul = '';
        ul += '<li><span class="col-lg-10">'+individuInfo.nom+'('+individuInfo.cout+')</span> ';
        ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'"></span>';
        ul += '</li>'
        ul += '</ul>';

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
        var ul = '';
        ul += '<li><span class="col-lg-10">'+individuInfo.nom+'('+individuInfo.cout+')</span> ';
        ul += '<span class="col-lg-1"><span class="glyphicon glyphicon-trash" style="cursor: pointer" data-id="'+individuInfo.id+'"></span>';
        ul += '</li>'
        ul += '</ul>';
        $(".listNonCombatUnitNameResume").append(ul);
        $(".pointResume").html(Number($(".pointResume").html()) + Number(individuInfo.cout));
        $("#modalListNUC").modal('hide');
    });
});



$(document).on('click', '.listCombatUnitNameResume .glyphicon.glyphicon-trash, .listNonCombatUnitNameResume .glyphicon.glyphicon-trash, .commandantNameResume .glyphicon.glyphicon-trash', function () {
    var toDelete = $(this);
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetInfoIndividu'),
        data: { id: $(this).data('id')},
    })
    .done(function( msg ) {
        $(toDelete).closest("li").remove();
        $(".pointResume").html(Number($(".pointResume").html()) - Number(msg.cout));
    });
});


function getIndividus(factionId, typeId, selectId, modalId, btnToAdd)
{
    $.ajax({
        method: "POST",
        url: Routing.generate('ajaxGetListIndividus'),
        data: { faction: factionId, type: typeId},
    })
    .done(function( msg ) {

        var ul = '';
        for(var individuInfo in msg){
            ul += '<li><span class="row">'+msg[individuInfo].nom+'</span>';
            ul += '<span class="row">';
            if(selectId != '.listCmd')
                ul += msg[individuInfo].cout+' points - ';
            ul += msg[individuInfo].typeIndividu;
            ul +='</span>';
            ul += '<span class="row text-center"><button type="button" class="btn btn-primary '+btnToAdd+'" id="'+msg[individuInfo].id+'">Ajouter</button></span>';
            ul += '</li>'
        }
        ul += '</ul>';
 
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

