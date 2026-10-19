import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo electrónico no es válido'],
    unique: true
  },
  passwordHash: { type: String, required: true, select: false },
  roles: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }],
    default: []
  },
  activo: { type: Boolean, default: true, required: true }
}, { timestamps: true });

export default mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
