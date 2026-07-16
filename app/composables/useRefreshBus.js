/**
 * Bus d'événements global — singleton JS pur (pas de useState Nuxt).
 * Fonctionne partout : setup(), composants, plugins.
 *
 * Usage — émettre après une action :
 *   const { emit } = useRefreshBus()
 *   emit('stats')   // rafraîchit tous les dashboards abonnés
 *   emit('biens')   // rafraîchit toutes les listes de biens
 *
 * Usage — écouter dans une page :
 *   const { on } = useRefreshBus()
 *   on('stats', () => loadStats(true))
 *
 * Events : 'stats' | 'biens' | 'rapports' | 'visites' | 'agents' | 'all'
 */

// Singleton module — partagé entre toutes les instances, survit aux navigations
const _listeners = new Map()

export function useRefreshBus() {
  /**
   * S'abonner à un event.
   * Quand appelé dans un setup(), le cleanup est automatique au démontage.
   * @param {string} event
   * @param {() => void} callback
   */
  function on(event, callback) {
    if (!_listeners.has(event)) {
      _listeners.set(event, new Set())
    }
    _listeners.get(event).add(callback)

    // Cleanup automatique si appelé dans un composant Vue
    if (getCurrentInstance()) {
      onUnmounted(() => {
        _listeners.get(event)?.delete(callback)
      })
    }
  }

  /**
   * Déclencher un event — notifie immédiatement tous les abonnés.
   * @param {string} event
   */
  function emit(event) {
    // Déclencher les listeners de cet event spécifique
    _listeners.get(event)?.forEach(cb => {
      try { cb() } catch (e) { console.error('[RefreshBus] erreur dans listener', event, e) }
    })

    // Déclencher aussi les listeners 'all' (sauf si on émet 'all' lui-même)
    if (event !== 'all') {
      _listeners.get('all')?.forEach(cb => {
        try { cb() } catch (e) { console.error('[RefreshBus] erreur dans listener all', e) }
      })
    } else {
      // Si on émet 'all', déclencher tous les events
      _listeners.forEach((cbs, key) => {
        if (key !== 'all') cbs.forEach(cb => {
          try { cb() } catch (e) { console.error('[RefreshBus] erreur dans listener', key, e) }
        })
      })
    }
  }

  return { on, emit }
}
