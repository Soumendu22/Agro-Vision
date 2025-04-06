import mongoose, { Document, Schema } from 'mongoose';

export interface IFarmProfile extends Document {
  userId: mongoose.Types.ObjectId;
  farmName: string;
  farmSize: number;
  sizeUnit: 'acres' | 'hectares';
  primaryCrop: string;
  secondaryCrops?: string[];
  soilType: string;
  irrigationType: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const farmProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    minlength: [2, 'Farm name must be at least 2 characters long'],
  },
  farmSize: {
    type: Number,
    required: [true, 'Farm size is required'],
    min: [0, 'Farm size cannot be negative'],
  },
  sizeUnit: {
    type: String,
    required: true,
    enum: ['acres', 'hectares'],
  },
  primaryCrop: {
    type: String,
    required: [true, 'Primary crop is required'],
    enum: [
      'rice', 'wheat', 'corn', 'soybeans', 'cotton',
      'sugarcane', 'vegetables', 'fruits', 'other'
    ],
  },
  secondaryCrops: [{
    type: String,
    enum: [
      'rice', 'wheat', 'corn', 'soybeans', 'cotton',
      'sugarcane', 'vegetables', 'fruits', 'other'
    ],
  }],
  soilType: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: ['clay', 'sandy', 'loamy', 'silt', 'peat', 'chalky', 'other'],
  },
  irrigationType: {
    type: String,
    required: [true, 'Irrigation type is required'],
    enum: [
      'drip', 'sprinkler', 'surface', 'center-pivot',
      'subsurface', 'manual', 'none', 'other'
    ],
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180,
    },
  },
}, {
  timestamps: true,
});

// Add indexes
farmProfileSchema.index({ userId: 1 });
farmProfileSchema.index({ location: '2dsphere' });

// Check if the model exists before creating it
export default mongoose.models.FarmProfile || mongoose.model<IFarmProfile>('FarmProfile', farmProfileSchema); 