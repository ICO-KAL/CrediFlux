import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
  descripcion: { type: String, trim: true, maxlength: 1000 },
  permisos: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permiso' }],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.Rol || mongoose.model('Rol', rolSchema);
