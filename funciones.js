    var a_problema = new Array();
    var tableauA = new Array ();
    var tableau2 = new Array();
    var tableau2C = new Array();
    var zeta = new Array();
    var objetivo=1;
    var nVar, nRes;
    var contS=0, contA=0, contE=0, total=0;
    var i, j, k;
    var is = 0, ia = 0;
    var posicionArtif = new Array();
    var eliminarPosArtifi = new Array();
    var contVar;
    
    function generarSolucion()
    {
        for ( i = 0; i < nRes; i++ )
            if (a_problema[i][nVar+1]=="<=" || a_problema[i][nVar+1] == "=")
                    contS += 1;
            else    contS += 2;
        total = contS + nVar;
        
        //imprime(a_problema, nRes, nVar+1);
        inicializarMatriz(tableauA, nRes, total+2);
        //imprimeTableau(tableauA, nRes, total+1);
        agregarVariables(tableauA);
        imprimeTableau(tableauA, nRes, total+1);
        calcularWPrima(tableauA);
        imprimeTableau(tableauA, nRes, total+1);
        faseUno(tableauA);
        imprimeTableau(tableauA, nRes, total+1);
        iniciarFase2();
        imprimeTableau(tableau2, nRes, total - eliminarPosArtifi.length+1);
        faseDos();
    }


    function calcularWPrima(matriz)
    {
        var suma = 0;
        for (i = 0; i <= total+1; i++)
        {
            suma = 0;
            for (j=0; j < posicionArtif.length;j++)
            {
                suma += parseInt(matriz[posicionArtif[j]][i]);
            }
            matriz[0][i]=suma;
        }
    }

    function agregarVariables(matriz)
    {
        contVar = nVar;
        //inicializarMatriz(matriz, nRes, total+2);
        //imprime(matriz, nRes, total);
        //El tableau contiene los datos leídos de entrada
        for ( i = 1; i <= nRes; i++ )
        {
            for ( j = 0; j <= nVar; j++ )
            {
                if (j==nVar)
                    matriz[i][total+1] = a_problema[i-1][j];
                else matriz[i][j+1] = a_problema[i-1][j];
            }
        }

         posicionArtif.push(0);
         
        //Agregar variables de holgura, exceso y artificiales, en el orden de aparicion
        for ( i = 0; i < nRes; i++)
        {
            if (a_problema[i][nVar+1]=="<=")
                matriz[i+1][++contVar] = 1;

            else if (a_problema[i][nVar+1]=="=")
            {
                matriz[i+1][++contVar] = 1;
                eliminarPosArtifi.push(contVar);
                matriz[0][contVar] = -1;
                posicionArtif.push(i+1);
            }

            else if (a_problema[i][nVar+1] == ">=")
            {
                matriz[i+1][++contVar] = -1;
                matriz[i+1][++contVar] = 1;
                eliminarPosArtifi.push(contVar);
                matriz[0][contVar] = -1;
                posicionArtif.push(i + 1);
            }
        }
        matriz[0][0] = 1.0;
    }
 
    function iniciarFase2()
    {
        inicializarMatriz(tableau2, nRes+1, total - eliminarPosArtifi.length+2);
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


    function faseDos()
    {
        ajuste(tableau2, nRes, zeta.length,total - eliminarPosArtifi.length+1);
        imprimeTableau(tableau2, nRes, total - eliminarPosArtifi.length+1);
        finalizarFase(tableau2);
        imprimeTableau(tableau2, nRes, total - eliminarPosArtifi.length+1);
        
    }

    function ajuste(matriz, nf, nc, nc2)
    {
        for (var j=1; j <= nc; j++)
            if (matriz[0][j] < 0)
            {
                var aux = matriz[0][j];
                for (var i = 1; i <= nf; i++)
                    if (matriz[i][j]==1)
                        for (var k=0; k <= nc2;  k++)
                            tableau2[0][k]+=tableau2[i][k]*-1*aux;
            }
    }

    function finalizarFase(tableau2)
    {
        var bandera = 1;
        while (bandera!=0)
        {
            var mayor = 0;
            var menor = 1000000000;
            var myMap = new Map();
            var entra, sale;
            bandera = 0;

            imprimeTableau(tableau2, nRes, total - eliminarPosArtifi.length+1);
            if (objetivo == 1)
            {
                for (var j=1 ; j<=total - eliminarPosArtifi.length+2;j++)
                {
                    if (tableau2[0][j] < 0 && tableau2[0][j] < menor) 
                    {
                        menor = tableau2[0][j];
                        entra = j;
                        bandera = 1;
                    }
                }   
            }
            else if (objetivo == 0 )
            {
                for (var j=1; j<=total - eliminarPosArtifi.length+2;j++)
                {
                    if (tableau2[0][j] > 0 && tableau2[0][j]>mayor )
                    {
                        mayor = tableau2[0][j];
                        entra = j;
                        bandera = 1;
                    }
                }
            }

            for (var i = 0; i < nRes; i++)
            {
                if (tableau2[i+1][entra] >  0)
                    myMap.set(tableau2[i+1][total-eliminarPosArtifi.length+1]/tableau2[i+1][entra], i+1);
            }

            sale = myMap.values().next().value;
            hacerUno = parseFloat(tableau2[sale][entra]);

            for (var j=0; j<=total - eliminarPosArtifi.length+1;j++)
            {
                tableau2[sale][j]/=hacerUno;
                tableau2[sale][j] = parseFloat(tableau2[sale][j]);
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
                        tableau2[i][j] = parseFloat(tableau2[i][j]);
                    }
                }
            }
        }

    }

    function preparar()
    {
        nVar = parseInt(document.getElementById("nVariables").value);
        nRes = parseInt(document.getElementById("nRestricciones").value);
        var s="";

        if (nVar < 2)
        {
            alert("Se requieren como mínimo dos variables");
            document.getElementById("nVariables").focus();
            return 0;
        }

        if (nRes < 1)
        {
            alert("Se requiere como mínimo una restricción");
            document.getElementById("nRestricciones").focus();
            return 0;
         }

        if (document.getElementById("idoptmaximizar").checked == true)
                objetivo = 1;
        else    objetivo = 0;

        s += "Coeficientes del problema:<br> <table > <tr> <td></td>";       

        for (var i = 0; i < nVar; i++)
            s += "<td >X<sub>" +i+ "</sub></td>";
        s += "<td></td> <td></td></tr><tr>";

        if (objetivo==1)    
                s += "<td>Max Z = </td>";
        else    s += "<td>Min Z = </td>";          
              
        for(var j = 0; j < nVar; j++)
            s += "<td><input type='number name='txtx"+ j + "' id='txtx" + j +"'></td> ";         
        s += "<td></td><td></td></tr>";

        for (var i = 0; i < nRes; i++)
        {
            s += "<tr><td> Restricción "+ i +" </td>";
            for (var j = 0; j < nVar; j++)
                s += "<td><input type='number name='txtr"+i+"x"+j+"' id='txtr"+i+"x"+j+"' ></td>";
            s += "<td><select name='cmbr"+i+"' id='cmbr"+i+"'><option selected value='<=''><=</option>";
            s += "<option value='>='> >= </option><option value='='> = </option></select></td>";
            s += "<td><input type='number name='txtrhs"+i+"' id='txtrhs"+i+"' ></td></tr>";
        }       
        s += "</table>";
        document.getElementById("lectura").innerHTML = s;

        s = "<div><button onclick='resolver()'>Resolver</button></div>";
        document.getElementById('datos').innerHTML = s;     
    }

    function resolver()
    {
        var s = "";

        inicializarMatriz(a_problema, nRes, nVar+1);
        
        for (var i = 0; i < nVar; i++)
        {
            if ( document.getElementById( "txtx" + i).value == "" )
                    zeta[i] = 0.0;
            else zeta[i] = parseFloat( document.getElementById( "txtx" + i).value );
        }
            
        for (var i = 0; i < nRes; i++)
        {
            for (var j = 0; j < nVar; j++)
            {
                if ( document.getElementById("txtr" + i + "x" + j).value == "")
                        a_problema[i][j] = 0.0;
                else    a_problema[i][j] = parseFloat(document.getElementById("txtr" + i + "x" + j).value);
            }
            
            if (document.getElementById("txtrhs" + i).value == "")
                    a_problema[i][nVar] = 0.0;
            else    a_problema[i][nVar] = parseFloat(document.getElementById("txtrhs" + i).value); 
            a_problema[i][nVar+1] = document.getElementById("cmbr" + i).value;   
        }
        generarSolucion();   
    }

    function inicializarMatriz(matriz, nf, nc)
    {
        for ( i = 0; i <= nf; i++ )
        {
            matriz[i] = new Array();
            for ( j = 0; j <= nc; j++ )
                matriz[i][j] = 0;
        }

    }

    function imprimeTableau( matriz, nf, nc )
    {
        var br = document.createElement('br');
        var an = document.getElementById('content');
        document.body.appendChild(br);
        var table = document.createElement('table');
        table.id = "normal";
        

        for (var k = 0; k <= nf; k++)
        {
            var tr =  document.createElement('tr');
            for ( var l = 0; l <= nc; l++)
            {
                var td = document.createElement('td');
                var text =  document.createTextNode(matriz[k][l].toFixed(5));
                td.appendChild(text);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            document.body.appendChild(table);
        }
    }


    function imprime(matriz, nr, nc)
    {
        document.write("<br>");
        for (var k =0; k <= nr; k++){
            for (var l=0; l <= nc; l++)
                document.write(matriz[k][l]);
            document.write("<br>");
        }
    }


    function calcularWPrima2()
    {
        inicializarMatriz(tableau2C, nRes+1, total - eliminarPosArtifi.length+2);
        tableau2C[0][0]=1;

        //console.log(zeta.length);
        for(var k=1; k<=zeta.length; k++)
        {
            if(tableau2[0][k]!=0 )
            {
                //imprimeTableau(tableau2, nRes, total - eliminarPosArtifi.length+1);
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

            imprimeTableau(tableau2C, nRes, total - eliminarPosArtifi.length+1);
        
    }

    //Calculamos la primera fase con el tableauA
    function faseUno (matriz)
    {
        var bandera = 1;   

        while ( bandera != 0 )
        {
            var mayor = 0.0;
            var menor = 1000000000.0;
            var entraMax, saleMin, hacerUno;
            bandera = 0;

            //Imprimimos el tableau actual
            imprimeTableau(matriz, nRes, total + 1);
            //Seleccionamos la variable de entrada
            for (j = 1; j <= total; j++)
            {
                if (matriz[0][j] > 0 && matriz[0][j] > mayor)
                {
                    mayor = matriz[0][j];
                    entraMax = j;
                    bandera = 1;
                }
            }

            //Seleccion de la variable de salida
            for (i = 1;i <= nRes; i++ )
            {
                if ( entraMax > 0 && matriz[i][entraMax] > 0)
                {
                    if (matriz[i][total+1] / matriz[i][entraMax] < menor)
                    {
                        menor = parseFloat(matriz[i][total+1] / matriz[i][entraMax]);
                        saleMin = i;
                    }
                }
            }

            // Calculamos las variables de la siguiente iteracion
            var hacerUnoA = matriz[saleMin][entraMax];
            hacerUno = parseFloat(hacerUnoA);
            //console.log(hacerUno);

            for(var j=1; j<=total+1; j++)
            {
                matriz[saleMin][j]/=hacerUno;
                //matriz[saleMin][j] = parseFloat(matriz[saleMin][j]);
            }

            //imprimeTableau(matriz, nRes, total+1);
        
            for(var i = 0; i <= nRes; i++)
            {
                var vector = new Array();
                if(matriz[i][entraMax] != 0 && i != saleMin)
                {
                    var aux = matriz[i][entraMax];
                    for(var j = 0; j <= total+1; j++){
                        //vector.push(matriz[saleMin][j]*aux*-1);
                        matriz[i][j]+=matriz[saleMin][j]*aux*-1;
                        if (matriz[i][j]<=2.220446049250313e-10 && matriz[i][j] >= -4.440892098500626e-10)
                           matriz[i][j]=0;
                        //matriz[i][j] = parseFloat(matriz[i][j]);
                    }
                }
            }
        }
    }