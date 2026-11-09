import { computed, ref } from 'vue'
import locations from '@/data/locations.json'
import { stateNames } from '@/data/site'
import { filterLocations, locationStats, stateCounts } from '@/utils/locations'

export function useLocationFilter(list = locations) {
  const state = ref('All')
  const query = ref('')

  const filtered = computed(() => filterLocations(list, { state: state.value, query: query.value }))
  const stats = computed(() => locationStats(list))
  const chips = computed(() => stateCounts(list, Object.keys(stateNames)))

  return { state, query, filtered, stats, chips, all: list }
}
