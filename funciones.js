    var a_problema = new Array();
    var tableauA = new Array ();
    var zeta = new Array();
    var novariables;
    var norestricciones;
    var objetivo;
    var nVar, nRes;
    var contS=0, contA=0, contE=0, total=0;
    var i, j, k;
    var is = 0, ia = 0;

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
            tableauA[i] = new Array(total + 1);

        for (i=0; i <= nRes;i++)
            for (j=0; j <= total;j++)
                tableauA[i][j] = 0;

        agregarVariables();
        calcularWPrima();
        //ver si es correcto lo anterior
        
        document.write("<br>");
        
        for (i=0; i <= nRes;i++){
            for (j=0; j < total+1;j++)
                document.write(tableauA[i][j]);
            document.write("<br>");
        }
    }

    var posicionArtif = new Array();
    var eliminarPosArtifi = new Array();

    function agregarVariables()
    {
        var seleccion;
        var contVar = nVar;
        //El tableau contiene los datos leídos de entrada
        for ( i = 1; i <= nRes; i++ )
        {
            for ( j = 0; j <= nVar; j++ )
            {
                if (j==nVar)
                    tableauA[i][total]=a_problema[i-1][j];
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
                eliminarPosArtifi.push(contVar);
                tableauA[0][contVar] = -1;
                //tableauA[i][contVar++] = 1;
                posicionArtif.push(i+1);
            }
            else if (a_problema[i][nVar+1] ==">="){
                tableauA[i+1][contVar++] = -1;
                tableauA[i+1][contVar++] = 1;
                eliminarPosArtifi.push(contVar);
                tableauA[0][contVar]=-1;
                posicionArtif.push(i+1);
            }
        }
        
        //for (i=0; i < nVar; i++)
         //   tableauA[0][i] = zeta[i];
        tableauA[0][0] = 1;
    }

    function calcularWPrima()
    {
        var suma = 0;
        for (i = 0; i <= total; i++)
        {
            suma = 0;
            for (j=0; j < posicionArtif.length;j++)
                suma += parseInt(tableauA[posicionArtif[j]][i]);
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
        
        if (document.getElementById("idoptmaximizar").checked==true)
            objetivo = "Max ";
        else objetivo = "Min";   

        s= "<br><br>Mostrar Iteraciones<input type='checkbox' name='chkiteraciones' checked  value='ON' id='chkiteraciones'><br><br>";
        s= s+"<div><button onclick='resolver()'>Resolver</button></div>";

        document.getElementById('datos').innerHTML = s;
    }

    function resolver()
    {
        var s = "";
        var i, j, k;
        var objetivo = 0;
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
        //imprime();    
    }


    function imprime()
    {
        for ( i = 0; i < nVar; i++)
            document.write(zeta[i]);

        document.write("<br>");
        for ( i = 0; i<nRes; i++)
        {
            for ( j = 0;j <= nVar+1; j++ )
                document.write(a_problema[i][j]);
            document.write("<br>");
        }
    }

