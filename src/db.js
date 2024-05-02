import Dexie from 'dexie'

export const db = new Dexie('citas');
db.version(2).stores({
  appointments: '++id, nombre, correo, telefono, dia,hora, mensaje, estado' // Primary key and indexed props
});


// Función para actualizar una cita en la base de datos
export const actualizarCita = async (citaId, nuevosDatos) => {
  try {
    // Obtener la cita de la base de datos usando su ID
    const cita = await db.appointments.get(citaId);

    // Verificar si la cita existe
    if (!cita) {
      console.error('La cita no existe');
      return;
    }

    // Actualizar los datos de la cita con los nuevos datos proporcionados
    Object.assign(cita, nuevosDatos);

    // Actualizar la cita en la base de datos
    await db.appointments.update(citaId, cita);

    console.log('Cita actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
  }
};