$(document).on('click', '.btn-integracao', function (event) {
    
    event.preventDefault()
    
   
    let button = $('#btn-integracao')
    let loadingButton = $('#loading');
    
    loadingButton.addClass('loading')  // Adiciona a classe .loading ao botão
    
    $("#msg").hide();
    $("#msg").empty()


    $.ajax({
            url: '/api',
           
            type: 'GET',
            dataType: "json",
            beforeSend: function(){
            
                $('#btn-integracao').css({
                    'background-color': '#FBB635',
                    'border': '1px solid #FBB635'
                });
                button.hide();
                loadingButton.show(); // Mostra o botão de carregamento
            },
            complete: function(){
                $('#btn-integracao').css({
                    'background-color': '',
                    'border': ''
                });
                button.removeClass('loading'); // Remove a classe .loading do botão
                
                loadingButton.hide(); // Esconde o botão de carregamento
                button.show();
            },
            success: function(result){
                console.log(result)
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(errorThrown)
            }
      }) 
        
        

    event.preventDefault()
});  