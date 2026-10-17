import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombres: { type: String, required: true, trim: true, maxlength: 100 },
  apellidos: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo electrónico no es válido'],
    unique: true
  },
  telefono: { type: String, required: true, trim: true, maxlength: 30 },
  fechaNacimiento: {
    type: Date,
    required: true,
    validate: {
      validator: (fecha) => fecha <= new Date(),
      message: 'La fecha de nacimiento no puede estar en el futuro'
    }
  },
  estado: {
    type: String,
    enum: ['activo', 'suspendido', 'bloqueado'],
    default: 'activo',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Cliente || mongoose.model('Cliente', clienteSchema);