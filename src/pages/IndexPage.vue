<template>
  <q-page class="q-pa-lg">
    <p class="text-h4">Operations</p>
    <div class="row flex-center q-gutter-md q-mb-xl">
      <q-select label="Operation" v-model=operation.operationId :options="operationOptions" outlined class="col-2" emit-value map-options></q-select>
      <q-input label="Number 1" v-model.number="operation.number1" outlined type="number" v-if="operation.operationId <= 4"></q-input>
      <q-input label="Number 2" v-model.number="operation.number2" outlined type="number" v-if="operation.operationId <= 3"></q-input>
      <q-btn @click="getOperationResult" :disable="operation.operationId === undefined">Give me the result</q-btn>
      <q-input label="Result" v-model=operationResult outlined class="col" readonly></q-input>
    </div>

    <p class="text-h4">Records</p>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :rows-per-page-options="[5,10]"
      @request="requestData"
      binary-state-sort
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="deleteById(props.key)" icon="delete" dense flat round></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const operation = ref({ number1: 0, number2: 0, operationId: undefined })
const operationOptions = [
  { label: 'Addition', value: 0 },
  { label: 'Subtraction', value: 1 },
  { label: 'Multiplication', value: 2 },
  { label: 'Division', value: 3 },
  { label: 'Square root', value: 4 },
  { label: 'Random string', value: 5 }
]
const operationResult = ref(null)
const $q = useQuasar()

const getOperationResult = async () => {
  try {
    const response = await api.post('/v1/operations', operation.value)
    operationResult.value = response.data.result
    await loadData()
  } catch (e) {
    console.log(e)
    $q.notify({
      message: e.response.data.message,
      position: 'center',
      timeout: 1000
    })
  }
}

const rows = ref([])
const columns = [
  {
    label: 'ID',
    name: 'id',
    field: 'id',
    sortable: true
  },
  {
    label: 'Request',
    name: 'request',
    field: 'request'
  },
  {
    label: 'Response',
    name: 'response',
    field: 'response'
  },
  {
    label: 'Cost in credits',
    name: 'costInCredits',
    field: 'costInCredits',
    sortable: true
  },
  {
    label: 'Date',
    name: 'dateTime',
    field: 'dateTime',
    sortable: true,
    format: (val) => `${new Date(val).toLocaleString()}`
  },
  {
    label: 'Actions',
    name: 'actions',
    field: 'actions'
  }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'id',
  descending: false
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = pagination.value
  const response = await api.get(`/v1/records?page=${page}&rowsPerPage=${rowsPerPage}&sortBy=${sortBy}&descending=${descending ? 'DESC' : 'ASC'}`)
  rows.value = response.data.rows
  pagination.value.rowsNumber = response.data.rowsNumber
}

const deleteById = async (id) => {
  await api.delete(`/v1/records/${id}`)
  await loadData()
}

const requestData = ({ pagination: newPagination }) => {
  pagination.value = newPagination
  loadData()
}
</script>
