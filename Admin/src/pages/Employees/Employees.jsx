import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { Get, Remove } from "../../Services/Api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Employees() {
  const title = "Empleados";
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    Get("/getUsers").then((data) => {
      setEmployees(data.data.filter((x) => x.userType == "employee"));
    });
  }, []);

  const columns = [
    "Nombre",
    "Apellidos",
    "Correo Eletrónico",
    "Puesto",
    {
      name: "Acciones",
      options: {
        filter: false,
        print: false,
        download: false,
      },
    },
  ];

  function deleteEmployee(id) {
    Swal.fire({
      title: "Esta seguro de esta acción?",
      text: "Se va a perder esta información para siempre",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Remove("/deleteUser", id).then(() => {
          Swal.fire({
            title: "Eliminado",
            text: "Se eliminó con éxito",
            icon: "success",
            timer: 1500,
          }).then(() => window.location.replace("/Empleados"));
        });
      }
    });
  }

  const Options = (id) => {
    return (
      <>
        <a
          href={`/EditarEmpleado/${id}`}
          className="btn btn-primary btn-sm mx-1"
        >
          <i className="fa fa-edit"></i>
        </a>
        <button
          type="button"
          onClick={() => {
            deleteEmployee(id);
          }}
          className="btn btn-danger btn-sm mx-1"
        >
          <i className="fa fa-trash-o"></i>
        </button>
        <a href={`/Cliente/${id}`} className="btn btn-success btn-sm mx-1">
          <i className="fa fa-eye"></i>
        </a>
      </>
    );
  };

  return (
    <Layout title={title}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand">{title}</a>
        <div className="ml-auto">
          <a
            href="/AgregarEmpleado"
            className="btn btn-primary mx-1"
            type="button"
          >
            Agregar
          </a>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row clearfix">
          <div className="col-lg-12 col-md-12">
            <div className="table-responsive">
              <Table
                title={"Empleados"}
                data={employees.map((employee) => [
                  employee.name,
                  employee.lastName,
                  employee.email,
                  employee.position,
                  Options(employee._id),
                ])}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
