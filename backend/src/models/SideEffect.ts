import mongoose, { Document, Schema } from 'mongoose';

export interface ISideEffect extends Document {
  userId: mongoose.Types.ObjectId;
  effectType: string;
  severity: number;
  date: Date;
  notes?: string;
}

const SideEffectSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  effectType: {
    type: String,
    required: true,
    enum: ['nausea', 'vomiting', 'diarrhea', 'constipation', 'fatigue', 'headache', 'dizziness', 'other']
  },
  severity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model<ISideEffect>('SideEffect', SideEffectSchema);