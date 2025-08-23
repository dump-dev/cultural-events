export default interface BlacklistRepository {
  addItem(key: string, ttlInMs: number): Promise<void>;
  hasItem(key: string): Promise<boolean>;
}
