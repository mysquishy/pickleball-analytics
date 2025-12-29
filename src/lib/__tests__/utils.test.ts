import { cn } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
    });

    it('should handle conditional classes', () => {
      expect(cn('btn', false && 'hidden', true && 'visible')).toBe('btn visible');
    });

    it('should handle Tailwind conflict resolution', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
    });

    it('should handle undefined and null', () => {
      expect(cn('btn', undefined, null, 'active')).toBe('btn active');
    });
  });
});
