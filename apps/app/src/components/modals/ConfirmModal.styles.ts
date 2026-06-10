import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: '82%',
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.xl,
    overflow: 'hidden',
  },

  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: t.fontSize.lg,
    fontWeight: t.fontWeight.bold,
    color: t.colors.text.primary,
    textAlign: 'center',
  },

  message: {
    fontSize: t.fontSize.sm,
    color: t.colors.text.secondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: t.colors.divider,
  },

  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDivider: {
    width: 1,
    backgroundColor: t.colors.divider,
  },

  buttonTextCancel: {
    fontSize: t.fontSize.md,
    fontWeight: t.fontWeight.medium,
    color: t.colors.text.secondary,
  },

  buttonTextDefault: {
    fontSize: t.fontSize.md,
    fontWeight: t.fontWeight.semiBold,
    color: t.colors.primary,
  },

  buttonTextDestructive: {
    fontSize: t.fontSize.md,
    fontWeight: t.fontWeight.semiBold,
    color: t.colors.semantic.error,
  },
})
