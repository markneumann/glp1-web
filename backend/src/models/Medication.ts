import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication extends Document {
  userId: mongoose.Types.ObjectId;
  medicationName: string;
  dosage: number;
  dosageUnit: string;
  injectionSite: string;
  date: Date;
  time: string;
  notes?: string;
}

const MedicationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationName: {
    type: String,
    required: true,
    enum: ['Ozempic', 'Wegovy', 'Mounjaro', 'Zepbound', 'Other']
  },
  dosage: {
    type: Number,
    required: true,
    min: 0
  },
  dosageUnit: {
    type: String,
    required: true,
    enum: ['mg', 'ml', 'units']
  },
  injectionSite: {
    type: String,
    required: true,
    enum: ['abdomen', 'thigh', 'arm', 'buttocks']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model<IMedication>('Medication', MedicationSchema);