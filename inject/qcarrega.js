$(function(){
	var celulas = $($("#div_secao_esquerda").find("tr"));
	parametros = new Map();

	$(location).attr('href').split("?")[1].split("&").forEach(e => {
		parametros.set(e.split("=")[0], e.split("=")[1]);
	});;

	var alunos = "Nome\n";
	for (var i = 6; i < celulas.length-3; i++) {
		var aluno = $(celulas[i]).find("td:nth-child(2)").text();
		alunos +=  aluno + "\n";
	}
	var disc = $($(".dado_cabecalho")[4]).text().trim();
	if(parametros.get("t") == 3066)

		if(parametros.get("MODO").split("#")[0] == "FALTAS")
			$("body").append($("<div />").addClass("button_export").text("Exportar lista de alunos"));
		else{
			var file = "<input type='file' name='carregaAula' id='carregaAula'>";
			$("body").append($("<div />").addClass("button_aula").text("Exportar arquivo para registro"));
			$("body").append("<div id='carregaAula'>"+file+"</div>");
		}

	if(parametros.get("t") == 3068){
		var file = "<input type='file' name='notas' id='notas'>";
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

	$(".button_aula").click(function(){
		var a = document.createElement('a');
		var data_type = 'data:text/csv;charset=utf-8,%EF%BB%BF';
		var table_div = encodeURIComponent("Data;Horario inicial;CH;Conteúdo");
		a.href = data_type + table_div;
		a.download = "Aulas - "+disc+".csv";
		a.click();
        e.preventDefault();
        return false
    });

	$("#notas").change(function(e){
		var avaliacao = $($(".dado_cabecalho")[9]).text().trim();;
		var ext = $("input#notas").val().split(".").pop().toLowerCase();
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

	$("#carregaAula").change(function(e){

		var linhas = $(".conteudoTexto").find("tr");
		var registros = [];
		
		for (var i = 6; i < linhas.length-1; i++) {
			registros.push($($(linhas[i]).find("td")[0]).find("a")[0].text.substring(0, 10));
		}

		var linhas = linhas[3];
		if (e.target.files != undefined){
			var reader = new FileReader();
			reader.onload = function(e){
				var aulas=e.target.result.split("\n");
				for (var i = 1; i < aulas.length; i++) {
					var aula = aulas[i].split(";");
					if(aula[0] && !registros.includes(aula[0])){
						$($(linhas).find("input")[7]).val(aula[0]);
						$($(linhas).find("input")[8]).val(aula[1]);
						$($(linhas).find("input")[9]).val(parseInt(aula[1].split(":")[0])+parseInt(aula[2])+":"+aula[1].split(":")[1]);
						$($(linhas).find("input")[10]).val(aula[2]);
						$($(linhas).find("textarea")[0]).val("Aula remota - "+aula[3]);
						break;
					}

				}
			}
			reader.readAsText(e.target.files.item(0));
		}
	});
});