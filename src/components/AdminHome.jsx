import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { Chip } from "@nextui-org/react";
import { db, actualizarCita } from "../db.js";
import { useLiveQuery } from "dexie-react-hooks";
import { FaTrash } from "react-icons/fa";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { MdModeEdit } from "react-icons/md";
export default function AdminHome() {
  return (
    <>
      <section className=" h-full w-full container mx-auto pt-24">
        <div className="mx-10">
          <TableAppointment />
        </div>
      </section>
    </>
  );
}

function TableAppointment() {
  const [appointments, setAppointments] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetchData(setAppointments);
  }, []);
  const [nuevoId, setNuevoId] = useState(0);
  const [nuevoNombre, setNuevoNombre] = useState("");

  const handleUpdate = (id, nombre) => {
    setNuevoId(id);
    setNuevoNombre(nombre);
  };

  const [deleteId, setDeleteId] = useState(0);
  const [deleteNombre, setDeleteNombre] = useState("");
  const handleDelete = async (id) => {
    await db.appointments.delete(id)
    fetchData(setAppointments);
  }

  const handleColorSet = (estado) => {
    if (estado === "Pendiente") {
      return "warning";
    } else if (estado === "Finalizado") {
      return "success";
    } else if (estado === "Cancelada") {
      return "danger";
    } else {
      return "secondary";
    }
  } 

  return (
    <>
      <Table aria-label="Tabla con las citas">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Correo</TableColumn>
          <TableColumn>Telefono</TableColumn>
          <TableColumn className="flex  justify-center items-center">
            <BsCalendarDateFill />
          </TableColumn>
          <TableColumn className="  justify-center items-center">
            <FaClock />
          </TableColumn>
          <TableColumn>Mensaje</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        {appointments.length === 0 ? (
          <TableBody emptyContent={"No hay datos para mostrar."}>
            {[]}
          </TableBody>
        ) : (
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.nombre}</TableCell>
                <TableCell>{appointment.correo}</TableCell>
                <TableCell>{appointment.telefono}</TableCell>
                <TableCell>{appointment.dia}</TableCell>
                <TableCell>{appointment.hora}</TableCell>
                <TableCell>{appointment.mensaje}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="capitalize"
                    color={
                      handleColorSet(appointment.estado)
                    }
                  >
                    {appointment.estado}
                  </Chip>
                </TableCell>
                <TableCell>
                 <div className="flex flex-col md:flex-row gap-2">
                 <Button
                    onPress={() => {
                      onOpen();
                      handleUpdate(appointment.id, appointment.nombre);
                    }}
                    isIconOnly 
                    size="sm"
                    color="primary"
                    variant="ghost"
                  >
                    <MdModeEdit/>
                  </Button>
                  <Button
                  size="sm"
                   isIconOnly 
                   color="danger"
                   variant="ghost"
                   onPress={()=>{
                    handleDelete(appointment.id)
                   }}
                 >
                     <FaTrash/>
                  </Button>
                 </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <UpdateStatus
        id={nuevoId}
        nombre={nuevoNombre}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setAppointments={setAppointments}
      />
      
    </>
  );
}

async function fetchData (setAppointments) {
  try {
    const data = await db.appointments.orderBy('estado').toArray();
    setAppointments(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }


}

import { RadioGroup, Radio } from "@nextui-org/react";

function UpdateStatus({ id, nombre, isOpen, onOpenChange, setAppointments }) {
  const [estado, setEstado] = useState("Pendiente");
  const [nuevosDatos, setNuevosDatos] = useState({})

  const actualizarCita = async (id, nuevosDatos) => {
    try {
      // Obtener la cita de la base de datos usando su ID
      const cita = await db.appointments.get(id);
      // Verificar si la cita existe
      if (!cita) {
        console.error('La cita no existe');
        return;
      }
  
      // Actualizar los datos de la cita con los nuevos datos proporcionados
      const datosActualizados = { ...cita, ...nuevosDatos };
      await db.appointments.update(id, datosActualizados);
      console.log('Cita actualizada correctamente');
      fetchData(setAppointments)
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      throw error; // Reenviar el error para manejarlo en el componente que llama a la función
    }
  };

  useEffect(()=>{
    setNuevosDatos({estado : estado})
  }, [estado])
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cambiar estado
              </ModalHeader>
              <ModalBody>
                <h2>
                  Estas editando la cita de <em>{nombre}</em>
                </h2>
                <div>
                  <RadioGroup label="Selecciona el estado"
                  value={estado}
                  onValueChange={setEstado} >
                    <Radio
                      value="Finalizado"
                      description="La cita ya finalizo."
                      color="success"
                    >
                      Finalizado
                    </Radio>
                    <Radio
                      value="Pendiente"
                      description="La cita aun no se completa"
                      color="warning"
                    >
                      Pendiente
                    </Radio>
                    <Radio value="Cancelada" description="La cita fue cancelada" color="danger">
                      Cancelada
                    </Radio>
                 
                  </RadioGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={()=>{actualizarCita(id, nuevosDatos); onClose()}}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

// function DeleteQuery({id, nombre,isOpen, onOpenChange, setAppointments}){
//   // db.appointments.delete(id)
//   return(
//     <>
     
//     </>
//   )
// }