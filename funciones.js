    var a_problema = new Array();
    var tableauA = new Array ();
    var tableau2 = new Array();
    var zeta = new Array();
    var novariables;
    var norestricciones;
    var objetivo=1;
    var nVar, nRes;
    var contS=0, contA=0, contE=0, total=0;
    var i, j, k;
    var is = 0, ia = 0;
    var posicionArtif = new Array();
    var eliminarPosArtifi = new Array();

    function generaTabla()
    {
        for ( i = 0; i < nRes; i++ )
        {
            if (a_problema[i][nVar+1]=="<=" || a_problema[i][nVar+1] == "=")
                contS += 1;
            else 
                contS += 2;
        }

        total = contS + nVar; 
        //Matriz para el primer tableau

        tableauA = new Array(nRes);
        for ( i = 0; i <= nRes; i++ )
            tableauA[i] = new Array(total + 2);

        for (i=0; i <= nRes;i++)
            for (j=0; j <= total+1;j++)
                tableauA[i][j] = 0;

        //configuracion inicial
        agregarVariables();
        calcularWPrima();
        
        //Listo el primer tableau, podemos iniciar con la FASE 1
        faseUno();

        //Creamos el tableau para la segunda fase
        iniciarFase2();
        faseDos();
    }

    function iniciarFase2()
    {
        for (var i = 0; i <= nRes; i++)
        {
            tableau2[i]= new Array();
            for (var j=0; j <= total - eliminarPosArtifi.length+1; j++)
                tableau2[i][j]=0;
        }
        
        for(var i=0; i<nRes;i++)
        {
            var aux=0;
            var k=0;
            for(var j=0; j<=total+1;j++)
            {
                if(eliminarPosArtifi[aux]!=j)
                  tableau2[i+1][k++]=tableauA[i+1][j];
                else aux++;
            }
        }

        tableau2[0][0]=1; //valor de z

        for(var j=0; j<nVar;j++)
              tableau2[0][j+1] = -1* zeta[j];

      }

      var tableau2C = new Array();
      
    function calcularWPrima2()
    {
        for (var i=0; i<= nRes; i++)
            tableau2C[i]=new Array();
        for (var i=0; i<=nRes;i++)
            for (j=0;j<=total - eliminarPosArtifi.length+1;j++)
                tableau2C[i][j] = 0;
        tableau2C[0][0]=1;
        console.log(zeta.length);
        for(var k=1; k<=zeta.length; k++)
        {
            if(tableau2[0][k]!=0 )
            {
                //imprimeTableau2();
                var aux = tableau2[0][k];
                for (i=1;i<=nRes;i++)
                {
                    if (tableau2[i][k]==1)
                    {
                        for(var j=k; j<=total - eliminarPosArtifi.length+1; j++){                         
                            tableau2C[0][j] += (-1*aux*tableau2[i][j])+tableau2[0][j];
                        }
                    }
                }
            }
        
        }
        for (var i=1; i<=nRes;i++)
            for (j=0;j<=total - eliminarPosArtifi.length+1;j++)
                tableau2C[i][j] = tableau2[i][j];
            tableau2C[0][2]=0;
            imprimeTableau2C();
        
    }

    function faseDos()
    {
        var bandera = 1;
        while (bandera!=0)
        {
            var mayor = 0;
            var menor = 1000000000;
            var myMap = new Map();
            var entra, sale;
            bandera = 0;

            imprimeTableau2();
            if (objetivo == 1)
            {
                for (var j=1; j<=total - eliminarPosArtifi.length+1;j++)
                {
                    if (tableau2[0][j] < 0 && tableau2[0][j] < menor)
                    {
                        menor = tableau2[0][j];
                        entra = j;
                        bandera = 1;
                    }
                    else menor = 0;
                }   
            }
            else
            {
                for (var j=1; j<=total - eliminarPosArtifi.length+1;j++)
                {
                    if (tableau2[0][j] > 0 && tableau2[0][j]>mayor)
                    {
                        mayor = tableau2[0][j];
                        entra = j;
                        bandera = 1;
                    }
                    else mayor = 1000000000;
                }
            }

            if (mayor == 1000000000 || menor == 0)
            {
                calcularWPrima2();
                imprimeTableau2();
                break;

            }

            for (var i = 0; i < nRes; i++)
            {
                if (tableau2[i+1][entra] >0)
                    myMap.set(tableau2[i+1][total-eliminarPosArtifi.length+1]/tableau2[i+1][entra], i+1);
            }
            sale = myMap.values().next().value;
            hacerUno = parseFloat(tableau2[sale][entra]);

            for (var j=0; j<=total - eliminarPosArtifi.length+1;j++)
            {
                tableau2[sale][j]/=hacerUno;
                tableau2[sale][j] = parseFloat(tableau2[sale][j]).toFixed(2);
            }

            for(var i=0; i<=nRes; i++)
            {
                var vector = new Array();
                if(tableau2[i][entra]!=0 && i!=sale)
                {
                    var aux = tableau2[i][entra];
                    for(var j=0; j<=total+1; j++){
                        vector.push(tableau2[sale][j]*aux);
                        tableau2[i][j]-=vector[j];
                        tableau2[i][j] = parseFloat(tableau2[i][j]).toFixed(2);
                    }
                }
            } 
        }

    }

    //Calculamos la primera fase con el tableauA
    function faseUno ()
    {
        var bandera = 1;
        while ( bandera != 0 )
        {
            if (Math.abs(tableauA[0][total+1]-0)<=0.01)
                break;

            var mayor = 0;
            var menor = 1000000000;
            var entraMax, saleMin, hacerUno;
            bandera = 0;

            //Imprimimos el tableau actual
            imprimeTableau();
            //Seleccionamos la variable de entrada
            for (j=1; j<=total;j++)
            {
                if (tableauA[0][j] > 0 && tableauA[0][j]>mayor)
                {
                    mayor = tableauA[0][j];
                    entraMax = j;
                    bandera = 1;
                }
            }

            //Seleccion de la variable de salida
            for (i=1;i <= nRes;i++ )
            {
                if (tableauA[i][entraMax] > 0)
                {
                    if (tableauA[i][total+1]/tableauA[i][entraMax] < menor)
                    {
                        menor = tableauA[i][total+1]/tableauA[i][entraMax];
                        saleMin = i;
                    }
                }
            }

            // Calculamos las variables de la siguiente iteracion
            var hacerUnoA = tableauA[saleMin][entraMax];
            hacerUno = parseFloat(hacerUnoA).toFixed(3);

            for(var j=1; j<=total+1; j++)
            {
                tableauA[saleMin][j]/=hacerUno;
                tableauA[saleMin][j] = parseFloat(tableauA[saleMin][j]).toFixed(2);
            }

            for(var i=0; i<=nRes; i++)
            {
                var vector = new Array();
                if(tableauA[i][entraMax]!=0 && i!=saleMin)
                {
                    var aux = tableauA[i][entraMax];
                    for(var j=0; j<=total+1; j++){
                        vector.push(tableauA[saleMin][j]*aux);
                        tableauA[i][j]-=vector[j];
                        tableauA[i][j] = parseFloat(tableauA[i][j]).toFixed(2);
                    }
                }
            }

        }
    }

    //Revisar este pedo nadamás para ver que onda con los ajustes y redondeos
    function redondeo(numero, decimales)
    {
        var flotante = parseFloat(numero);
        var resultado = Math.round(flotante*Math.pow(10,decimales)) / Math.pow(10,decimales);
        return resultado;
    }

function imprimeTableau2C()
    {
        var tr = document.createElement('br');
        document.body.appendChild(tr);
        var table = document.createElement('table');
        table.id = "normal";

        for (var k = 0; k <=nRes; k++){
            var tr =  document.createElement('tr');
            for ( var l = 0; l <= total- eliminarPosArtifi.length +1; l++)
            {
                var td = document.createElement('td');
                var text =  document.createTextNode(tableau2C[k][l]);
                td.appendChild(text);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            document.body.appendChild(table);
        }
    }
    function imprimeTableau2()
    {
        var tr = document.createElement('br');
        document.body.appendChild(tr);
        var table = document.createElement('table');
        table.id = "normal";

        for (var k = 0; k <=nRes; k++){
            var tr =  document.createElement('tr');
            for ( var l = 0; l <= total- eliminarPosArtifi.length +1; l++)
            {
                var td = document.createElement('td');
                var text =  document.createTextNode(tableau2[k][l]);
                td.appendChild(text);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            document.body.appendChild(table);
        }
    }

    function imprimeTableau()
    {
        var tr = document.createElement('br');
        document.body.appendChild(tr);
        var table = document.createElement('table');
        table.id = "normal";

        for (var k = 0; k <=nRes; k++){
            var tr =  document.createElement('tr');
            for ( var l = 0; l <= total+1; l++)
            {
                var td = document.createElement('td');
                var text =  document.createTextNode(tableauA[k][l]);
                td.appendChild(text);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            document.body.appendChild(table);
        }
    }


    function agregarVariables()
    {
        var seleccion;
        var contVar = nVar+1;
        //El tableau contiene los datos leídos de entrada
        for ( i = 1; i <= nRes; i++ )
        {
            for ( j = 0; j <= nVar; j++ )
            {
                if (j==nVar)
                    tableauA[i][total+1]=a_problema[i-1][j];
                else tableauA[i][j+1] = a_problema[i-1][j];
            }
        }

         posicionArtif.push(0);
         
        //Agregar variables de holgura, exceso y artificiales, en el orden de aparicion
        for ( i = 0; i < nRes; i++)
        {
            if (a_problema[i][nVar+1]=="<=")
                tableauA[i+1][contVar++] = 1;

            else if (a_problema[i][nVar+1]=="="){
                tableauA[i+1][contVar++] = 1;
                eliminarPosArtifi.push(contVar-1);
                tableauA[0][contVar-1] = -1;
                posicionArtif.push(i+1);
            }

            else if (a_problema[i][nVar+1] ==">="){
                tableauA[i+1][contVar++] = -1;
                tableauA[i+1][contVar++] = 1;
                eliminarPosArtifi.push(contVar-1);
                tableauA[0][contVar-1]=-1;
                posicionArtif.push(i+1);
            }
        }
        tableauA[0][0] = 1;
    }

    function calcularWPrima()
    {
        var suma = 0;
        for (i = 0; i <= total+1; i++)
        {
            suma = 0;
            for (j=0; j < posicionArtif.length;j++)
            {
                suma += parseInt(tableauA[posicionArtif[j]][i]);
            }
            tableauA[0][i]=suma;
        }
    }
        
    function preparar()
    {
        novariables= document.getElementById("nVariables").value;
        norestricciones = document.getElementById("nRestricciones").value;
        var s="";
        var i,j,k;

        if (novariables < 2)
        {
            alert("Se requieren como mínimo dos variables");
            document.getElementById("nVariables").focus();
            return 0;
        }

        if (norestricciones < 1)
        {
            alert("Se requiere como mínimo una restricción");
            document.getElementById("nRestricciones").focus();
            return 0;
         }

        if (document.getElementById("idoptmaximizar").checked == true)
                objetivo = 1;
        else    objetivo = 0;

        s += "Coeficientes del problema:<br> <table > <tr> <td></td>";       

        for (i = 0; i < novariables; i++)
            s += "<td >X<sub>" +i+ "</sub></td>";
        s += "<td></td> <td></td></tr><tr>";

        if (objetivo==1)    
                s += "<td>Max Z = </td>";
        else    s += "<td>Min Z = </td>";          
              
        for(j = 0; j < novariables; j++)
            s += "<td><input type='text name='txtx"+ j + "' id='txtx" + j +"' value='6'></td> ";         
        s += "<td></td><td></td></tr>";

        for (i = 0; i < norestricciones; i++)
        {
            s += "<tr><td> Restricción "+i+" </td>";
            for (j = 0; j < novariables; j++)
                s += "<td><input type='text name='txtr"+i+"x"+j+"' id='txtr"+i+"x"+j+"' value='2'></td>";
            s += "<td><select name='cmbr"+i+"' id='cmbr"+i+"'><option selected value='<=''><=</option>";
            s += "<option value='>='> >= </option><option value='='> = </option></select></td>";
            s += "<td><input type='text name='txtrhs"+i+"' id='txtrhs"+i+"' value='3'></td></tr>";
        }       
        s += "</table>";
        document.getElementById("lectura").innerHTML = s;     
        tomarDatos();     
    }
      
    function tomarDatos()
    {
        var i, j, aux, s="";

        s= "<br><br>Mostrar Iteraciones<input type='checkbox' name='chkiteraciones' checked  value='ON' id='chkiteraciones'><br><br>";
        s= s+"<div><button onclick='resolver()'>Resolver</button></div>";

        document.getElementById('datos').innerHTML = s;
    }

    function resolver()
    {
        var s = "";
        var i, j, k;
        //var objetivo = 0;
        var generarreporte = false;

        nVar = parseInt(document.getElementById("nVariables").value);
        nRes = parseInt(document.getElementById("nRestricciones").value);

        for ( i = 0; i < nRes; i++ )
        {
            a_problema[ i ] = new Array();
            for ( j = 0; j <= nVar+1; j++ )
                a_problema[ i ][ j ] = 0;
        }
        
        for ( i = 0; i < nVar; i++ )
        {
            if ( document.getElementById( "txtx" + i).value == "" )
                    zeta[i] = 0;
            else zeta[i] = parseFloat( document.getElementById( "txtx" + i).value );
        }
            
        for ( i = 0; i < nRes; i++ )
        {
            for ( j = 0; j < nVar; j++ )
            {
                if ( document.getElementById("txtr" + i + "x" + j).value == "")
                        a_problema[i][j] = 0;
                else    a_problema[i][j] = parseFloat(document.getElementById("txtr" + i + "x" + j).value);
            }
            
            if (document.getElementById("txtrhs" + i).value == "")
                    a_problema[i][nVar] = 0;
            else    a_problema[i][nVar] = parseFloat(document.getElementById("txtrhs" + i).value); 
            a_problema[i][nVar+1] = document.getElementById("cmbr" + i).value;   
        }

        generaTabla();   
    }

    function imprime()
    {
        document.write("<br>");
        
        for (var k =0; k < nRes;k++){
            for (var l=0; l < total+2;l++)
                document.write(tableauA[k][l]);
            document.write("<br>");
        }
    }

