import React, { useState,useEffect } from 'react'
import {Pagination, Button, Popover} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import {DatePicker} from "@nextui-org/react";
import {Select, SelectItem, Textarea} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import CalendarSvg from '../assets/CALENDAR.svg'
import {Input} from "@nextui-org/react";
import { db } from '../db.js';

export default function UserHome() {
    const [currentPageProp, setCurrentPageProp] = useState(1)

    //UserDatePicker
    const [selectedDate, setSelectedDate] = useState()
    const [selectedHour, setSelectedHour] = useState();
    const [selectedMessage, setSelectedMessage] = useState('')
    const [dateInfo, setDateInfo] = useState([]);

    //UserPersonalData
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [userInfo, setUserInfo] = useState([]);


    const pageMapping  = {
        1 : <UserDatePicker value={selectedDate} setValue={setSelectedDate} value2={selectedHour} setValue2={setSelectedHour} value3={selectedMessage} setValue3={setSelectedMessage}/>,
        2 :  <UserPersonalData name={name} setName={setName} email={email} setEmail={setEmail} number={number} setNumber={setNumber}/>,
        3 : <UserConfirmation dateInfo={dateInfo} userInfo={userInfo}/>
    }

    const resetData = () => {
      setName('');
      setEmail('');
      setNumber('');
      setUserInfo([]);
      setSelectedDate();
      setSelectedHour();
      setSelectedMessage('');
      setDateInfo([]);
    }

   


    useEffect(()=>{
      setDateInfo([
        {
          Fecha: selectedDate ? selectedDate.month+'/'+selectedDate.day+'/'+selectedDate.year : '',
          Hora: selectedHour,
          Mensaje: selectedMessage
        }
      ])
    },[selectedMessage])

    useEffect(()=>{
      setUserInfo([
        {
          Nombre: name,
          Email: email,
          Numero: number
        }
      ])
    },[number])
  return (
    <section className='lg:columns-2 h-full w-full container mx-auto pt-24'>
            <div className="w-full h-full flex items-center justify-end flex-col hidden lg:flex">
                <h1 className='text-3xl lg:text-6xl xl:text-9xl italic font-semibold'> Bienvenido </h1>
                <Image src={CalendarSvg} width='400' height={400}/>
            </div>
            <div className="w-full h-full flex flex-col gap-4 items-center">
               <UserPagination currentPage={currentPageProp} setCurrentPage={setCurrentPageProp}/>
               <div className='w-[90%] h-[90%] bg-white rounded-md p-10'>
                 <div className='h-[95%]'>
                    {
                      pageMapping[currentPageProp]
                    }
                 </div>
                 <div className='h-[5%] flex justify-end'>
                     <UserPageChange currentPage={currentPageProp} setCurrentPage={setCurrentPageProp} userInfo={userInfo} dateInfo={dateInfo} resetData={resetData} />
                 </div>
               </div>
            </div>    
    </section>
  )
}


function UserPagination({currentPage, setCurrentPage}) {
    return (
        <>
          <div className="flex flex-col gap-5">
                    {/* <p className="text-small text-default-500">Selected Page: {currentPage}</p> */}
                    <Pagination
                        isDisabled
                        total={3}
                        initialPage={1}
                        radius="full"
                        color="secondary"
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
               
                </div>
        </>
    )
}

function UserPageChange({currentPage, setCurrentPage, dateInfo, userInfo, resetData}){
  const {isOpen, onOpen, onOpenChange} = useDisclosure(); 
  return(
        <>
          <div className="flex gap-2">
            <Button
            className={currentPage == 1 ? 'invisible' : '' }
            size="md"
            variant="flat"
            color="secondary"
            onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
            >
            Anterior
            </Button>
            <Button
            size="md"
            variant="flat"
            color="secondary"
            className={currentPage == 3 ? 'hidden' : '' }
            onPress={() => {setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev)) }}
            >
            Siguiente
            </Button>
            <Button onPress={onOpen} color="success" variant="flat" size="md"
                className={currentPage == 3 ? 'capitalize' : 'hidden' }
                >Confirmar</Button>
            <ConfirmPopOver  dateInfo={dateInfo} userInfo={userInfo} isOpen={isOpen} onOpenChange={onOpenChange} resetData={resetData} setCurrentPage={setCurrentPage}/>
        </div>
        </>
    )
}

function UserDatePicker({value, setValue, value2, setValue2, value3, setValue3}){
    // const [horas, setHoras] = useState();
    // const generarHoras = () => {
        
    //     // Definir la hora de inicio y fin del rango de citas
    //     const horaInicio = new Date();
    //     horaInicio.setHours(8, 0, 0); // 8:00 AM
      
    //     const horaFin = new Date();
    //     horaFin.setHours(14, 0, 0); // 14:00 PM
      
    //     // Array para almacenar las horas
    //     const horas1 = [];
      
    //     // Iterar desde la hora de inicio hasta la hora de fin, con un intervalo de 20 minutos
    //     let horaActual = new Date(horaInicio);
    //     while (horaActual <= horaFin) {
    //       // Agregar la hora actual al array de horas
    //       horas1.push(horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    //       // Incrementar la hora actual por el intervalo de 20 minutos
    //       horaActual.setMinutes(horaActual.getMinutes() + 20);
    //     }
      
    //     return horas1;
    //   };

    //   const handleHourChange = (selectedHour) => {
    //     // Convierte el conjunto de la hora seleccionada a un string
    //     const selectedHourString = selectedHour.values().next().value;
    //     // Actualiza el valor de la hora seleccionada como un string
    //     setValue2(selectedHourString);
    //   };

    //   useEffect(()=>{
    //     setHoras(generarHoras())
    //   },[])
    const [horas, setHoras] = useState([]);
    const [citasDelDia, setCitasDelDia] = useState([]);

    useEffect(() => {
        // Obtener las citas del día seleccionado
        if (value) {
            const fechaSeleccionada = new Date(value.year, value.month - 1, value.day);
            const citas = db.appointments
                .filter(appointment => {
                    const fechaCita = new Date(appointment.dia);
                    return fechaCita.toDateString() === fechaSeleccionada.toDateString();
                })
                .toArray()
                .then(citasArray => {
                    setCitasDelDia(citasArray);
                })
                .catch(error => {
                    console.error('Error al obtener citas del día:', error);
                });
        }
    }, [value]);

    useEffect(() => {
        // Generar las horas disponibles
        const generarHoras = () => {
            const horaInicio = new Date();
            horaInicio.setHours(8, 0, 0); // 8:00 AM

            const horaFin = new Date();
            horaFin.setHours(14, 0, 0); // 14:00 PM

            const horasDisponibles = [];
            let horaActual = new Date(horaInicio);
            while (horaActual <= horaFin) {
                const horaString = horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                // Verificar si la hora actual está ocupada
                const ocupada = citasDelDia.find(cita => cita.hora === horaString);
                if (!ocupada) {
                    horasDisponibles.push(horaString);
                }

                horaActual.setMinutes(horaActual.getMinutes() + 20);
            }
            return horasDisponibles;
        };

        setHoras(generarHoras());
    }, [value, citasDelDia]);

    const handleHourChange = (selectedHour) => {
        const selectedHourString = selectedHour.values().next().value;
        setValue2(selectedHourString);
    };

    return(
    <>
    <div className="flex flex-row gap-2">
      <div className="w-full max-w-xl flex flex-col gap-y-4">
        <h1 className='font-bold text-xl mx-auto'>Seleccion de fecha</h1>
        <DatePicker className="" label="Fecha" value={value} onChange={setValue} 
        visibleMonths={2}
        />
            <Select
            label="Hora"
            variant="flat"
            placeholder="00:00"
            // selectedKeys={value2}
            className=""
            value={value2}
            onSelectionChange={handleHourChange}
        >
                {
                 horas?   horas.map(hora => {
                        return(
                            <SelectItem key={hora} >{hora}</SelectItem>
                        )
                    }) :' '
                }
        </Select>
        <Textarea
        minRows={3}
        maxRows={3}
        disableAutosize={true}
        variant="flat"
        value={value3}
        onValueChange={setValue3}
        placeholder="Dejanos una nota"
      />
      </div>
    </div>
    </>
)
}

function UserPersonalData({ name, setName,email,setEmail, number, setNumber}){

    return(
    <>
    <div className="flex flex-row gap-2">
      <div className="w-full max-w-xl flex flex-col gap-y-4">
        <h1 className='font-bold text-xl mx-auto'>Ingresa tus datos</h1>
          <Input
        label="Nombre"
        placeholder="Escribe tu nombre"
        value={name}
        onValueChange={setName}
        />
        <Input
        label="Email"
        placeholder="Escribe tu correo electronico"
        value={email}
        onValueChange={setEmail}
       />
       <Input
        label="Telefono"
        placeholder="Escribe tu numero telefonico"
        value={number}
        onValueChange={setNumber}
       />
       </div>
       </div>
    </>
    )
}

function UserConfirmation ({dateInfo, userInfo}) {

  const [userData, setUserData] = useState([])
  const [dateData, setDateData] = useState([])

useEffect(()=>{
  setUserData(userInfo[0])
  setDateData(dateInfo[0])
},[])
  

    return(
        <>
        <div className="flex flex-row gap-2">
      <div className="w-full max-w-xl flex flex-col gap-y-4">
        <h1 className='font-bold text-xl mx-auto'>Confirma los datos</h1>
        <h2 className='text-2xl bold'>Datos personales</h2>
        <p className='text-purple'>
          <strong>Nombre:</strong> {
            userData.Nombre
          } <br/>
          <strong>Correo electronico:</strong> {
            userData.Email
          }<br/>
          <strong>Telefono:</strong> {
            userData.Numero
          }
        </p>
        <h2 className='text-2xl bold'>Datos de la cita</h2>
        <p>
        <strong>Fecha:</strong> {
            dateData.Fecha
          } <br/>
          <strong>Hora:</strong> {
            dateData.Hora
          }<br/>
          <strong>Mensaje</strong> {
            dateData.Mensaje
          }
        </p>
        </div>
        </div>
        </>
    )
}

function ConfirmPopOver ({dateInfo, userInfo, isOpen, onOpenChange, resetData, setCurrentPage}) {
  
  const [userData, setUserData] = useState([])
  const [dateData, setDateData] = useState([])

  const addAppointment = async () => {
    try {

      const id = await db.appointments.add({
        nombre: userData.Nombre,
        correo: userData.Email,
        telefono : userData.Numero,
        dia: dateData.Fecha,
        hora: dateData.Hora,
        mensaje: dateData.Mensaje,
        estado: 'Pendiente'
      })

      console.log('Cita agregada correctamente con el id '+id)
      resetData();    
       setCurrentPage(1);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.length > 0) {
      setUserData(userInfo[0]);
    }
    if (dateInfo && dateInfo.length > 0) {
      setDateData(dateInfo[0]);
    }
  }, [dateInfo, userInfo]);



  return(
    <>
             <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirmar cita</ModalHeader>
              <ModalBody>
                <p> 
                  
                  {userData.Nombre ? userData.Nombre : 'Usuario'}, ¿desea confirmar la cita el dia {dateData.Fecha ? dateData.Fecha : '/' +' '+dateData.Hora ? dateData.Hora : '/'} ?<br/>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="success" onPress={()=>{
                  addAppointment();
                  onClose();
                }}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}