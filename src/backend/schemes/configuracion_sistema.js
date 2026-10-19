import mongoose from "mongoose";

const configuracionSistemaSchema = new mongoose.Schema({
  claveConfig: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
  valorConfig: { type: String, required: true, trim: true, maxlength: 5000 }
}, { timestamps: true });

export default mongoose.models.ConfiguracionSistema
  || mongoose.model('ConfiguracionSistema', configuracionSistemaSchema);
