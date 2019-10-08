$(function(){
	var celulas = $($("#div_secao_esquerda").find("tr"));
	var pagina = $(location).attr('href').split("?")[1].split("&")[0].split("=")[1];
	var alunos = "Nome\n";
	for (var i = 6; i < celulas.length-3; i++) {
		var aluno = $(celulas[i]).find("td:nth-child(2)").text();
		alunos +=  aluno + "\n";
	}
	var disc = $($(".dado_cabecalho")[4]).text().trim();
	if(pagina == 3066)
		$("body").append($("<div />").addClass("button_export").text("Exportar lista de alunos"));
	if(pagina == 3068){
		var file = "<input type='file' name='filename' id='filename'>";
		//var divButton = "<div class='button_import'>Importar notas</div>";
		var carregaNotas = "<div id='carregaNotas'>"+file+"</div>";
		$("body").append(carregaNotas);
	}


	$(".button_export").click(function(){
		var a = document.createElement('a');
		var data_type = 'data:text/csv;charset=utf-8,%EF%BB%BF';
		var table_div = encodeURIComponent(alunos);
		a.href = data_type + table_div;
		a.download = disc+".csv";
		a.click();
        e.preventDefault();
        return false
    });

	$("#filename").change(function(e){
		var avaliacao = $($(".dado_cabecalho")[9]).text().trim();;
		var ext = $("input#filename").val().split(".").pop().toLowerCase();
		var linhas = $(".conteudoTexto").find("tr");
		if (e.target.files != undefined){
			var reader = new FileReader();
			reader.onload = function(e){
				var csvval=e.target.result.split("\n");
				av = csvval[0].split(";");
				var x = -1;
				for (var i = 0; i < av.length; i++) {
					if(av[i].trim() == avaliacao){
						x = i;
						break;
					}
				}
				if(x > 0){
					for (var i = 1; i < linhas.length-1; i++) {
			    		var colunas = $(linhas[i]).find("td");
			    		var nome = $(colunas[2]).text().trim();
			    		var nota = $(colunas[5]).find("input");
			    		nota.val(csvval[i].split(";")[x]);
		    		}
		    		alert("Notas carregadas para: "+ avaliacao+".\n Clique em salvar para concluir a operação.");
	    		}else{
	    			alert("Não existe uma coluna no arquivo com nome: "+ avaliacao);
	    		}
			}
			reader.readAsText(e.target.files.item(0));
		}
	});
});