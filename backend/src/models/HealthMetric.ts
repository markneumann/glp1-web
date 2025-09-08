import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthMetric extends Document {
  userId: mongoose.Types.ObjectId;
  metricType: string;
  value: number;
  unit: string;
  date: Date;
  notes?: string;
}

const HealthMetricSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metricType: {
    type: String,
    required: true,
    enum: ['weight', 'calories', 'protein', 'water', 'custom']
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
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

export default mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);