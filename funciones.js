var a_problema = new Array();
var tableauA = new Array ();
var zeta = new Array();
var novariables;
var norestricciones;
var objetivo;
var nVar, nRes;
var contS=0, contA=0, contE=0, total=0;


function generaTabla()
{
    var i, j, k;
    var is = 0, ia = 0;

    for ( i = 0; i < nRes; i++ )
    {
        if (a_problema[i][nVar+1]=="<=")
            contS++;
        else if (a_problema[i][nVar+1] == "=")
            contA++;
        else if (a_problema[i][nVar+1]==">=")
        {
            contA++;
            contS++;
        }
    }

    total = nVar + contS + contA; // Total de variables a agregar
    //document.writeln(total);
    
    //Matriz para el primer tableau
    for ( i = 0; i < nRes; i++ )
        tableauA[i] = new Array(total + 1);

    for ( i = 0; i < nRes; i++ )
    {
        for ( j = 0; j < nVar; j++ )
        {
            tableauA[i][j] = a_problema[i][j];

        }

        switch(a_problema[i][nVar+1])
        {
            case "<=":
                is++;
                for ( j = 0; j < contS; j++ )
                {
                    if ( is == j )
                        tableauA[i][nVar + j] = 1;
                    else
                        tableauA[i][nVar + j] = 0;
                }
                if ( contA >= 1)
                {
                    for (j=0;j<contA;j++)
                        tableauA[i][nVar+contS+j]=0;
                }
                case ">=":
                is++;
                ia++;
                
                for ( j = 0; j < contS; j++ )
                {
                    if ( is == j )
                        tableauA[i][nVar + j] = -1;
                    else
                        tableauA[i][nVar + j] = 0;
                }

                for ( j = 0; j < contA; j++ )
                {
                    if ( ia == j )
                        tableauA[i][nVar + contS + j] = 1;
                    else
                        tableauA[i][nVar + contS + j] = 0;
                }

                case "=":
                    ia++;
                    for ( j = 0; j < contS; j++ )
                        tableauA[i][nVar + j] = 0;
                    for ( j = 0; j < contA; j++)
                    {
                        if (ia == j)
                            tableauA[i][nVar + contS + j] = 1;
                        else
                            tableauA[i][nVar + contS + j] = 0;
                    }
        }
        tableauA[i][nVar + contS + contA + 1] = a_problema[i][nVar];
    }

    //ver si es correcto lo anterior
    for (i=0; i < nRes;i++){
        for (j=0; j < total+1;j++)
            document.write(tableauA[i][i]);
        document.write("<br>");
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
        //var novariables;
        //var norestricciones;
        //var objetivo;
        var i, j, aux, s="";

        //novariables = document.getElementById("nVariables").value;
        //norestricciones = document.getElementById("nRestricciones").value;  
        
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

       // document.write(n + "            " + m);

       // a_problema = new Array();

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
        for ( i=0; i < nVar;i++)
            document.write(zeta[i]);
        for ( i = 0; i<nRes; i++)
        {
            for ( j =0;j <=nVar+1; j++)
                document.write(a_problema[i][j]);
            document.write("<br>");
        }
        
      
    }

