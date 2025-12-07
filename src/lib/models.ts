import mongoose, { Schema, Model } from 'mongoose';

export interface IAppearance {
    company: string;
    period: string;
    frequency: number;
    sourceFile: string;
}

export interface IQuestion {
    _id: string;
    title: string;
    url: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    acceptanceRate: number;
    companies: string[];
    appearances: IAppearance[];
    updatedAt: Date;
}

export interface IUser {
    _id?: string;
    email: string;
    name: string;
    password: string;
    avatar?: string;
    leetcodeUsername?: string;
    createdAt: Date;
}

export type ProgressStatus = 'TODO' | 'ATTEMPTED' | 'SOLVED';

export interface IProgress {
    _id?: string;
    userId: string;
    questionId: string;
    status: ProgressStatus;
    notes: string;
    isBookmarked: boolean;
    dateSolved?: Date;
    updatedAt: Date;
}

const AppearanceSchema = new Schema<IAppearance>({
    company: { type: String, required: true },
    period: { type: String, required: true },
    frequency: { type: Number, default: 0 },
    sourceFile: { type: String }
}, { _id: false });

const QuestionSchema = new Schema<IQuestion>({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    acceptanceRate: { type: Number, default: 0 },
    companies: [{ type: String }],
    appearances: [AppearanceSchema],
    updatedAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    leetcodeUsername: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const ProgressSchema = new Schema<IProgress>({
    userId: { type: String, required: true, ref: 'User' },
    questionId: { type: String, required: true, ref: 'Question' },
    status: { type: String, enum: ['TODO', 'ATTEMPTED', 'SOLVED'], default: 'TODO' },
    notes: { type: String, default: '' },
    isBookmarked: { type: Boolean, default: false },
    dateSolved: { type: Date },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
UserSchema.index({ email: 1 });
ProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, isBookmarked: 1 });

// Prevent overwriting models during hot reload
const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Progress: Model<IProgress> = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

export { Question, User, Progress };


