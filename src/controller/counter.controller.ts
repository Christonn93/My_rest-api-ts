import Counter from '../models/counter.model';

export async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const sequenceDocument = await Counter.findOneAndUpdate({ _id: sequenceName }, { $inc: { sequenceValue: 1 } }, { new: true, upsert: true });

  return sequenceDocument.sequenceValue;
}
