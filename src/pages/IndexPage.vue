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
      :rows="records"
      :columns="recordColumns"
      row-key="id"
      v-model:pagination="recordsPagination"
      :rows-per-page-options="[5,10]"
      @request="getRecordsPagination"
      binary-state-sort>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="deleteRecordById(props.key)" icon="delete" dense flat round></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

onMounted(() => {
  getRecords()
})

/* OPERATIONS */
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

const getOperationResult = async () => {
  try {
    const response = await api.post('/v1/operations', operation.value)
    operationResult.value = response.data.result
    await getRecords()
  } catch (e) {
    $q.notify({
      message: e.response.data.message,
      position: 'center',
      timeout: 1000
    })
  }
}

/* RECORDS */
const records = ref([])
const recordsPagination = ref({ page: 1, rowsPerPage: 5, sortBy: 'id', descending: false })
const recordColumns = [
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

const getRecords = async () => {
  const { page, rowsPerPage, sortBy, descending } = recordsPagination.value
  const response = await api.get(`/v1/records?page=${page}&rowsPerPage=${rowsPerPage}&sortBy=${sortBy}&descending=${descending ? 'DESC' : 'ASC'}`)
  records.value = response.data.rows
  recordsPagination.value.rowsNumber = response.data.rowsNumber
}

const deleteRecordById = async (id) => {
  await api.delete(`/v1/records/${id}`)
  await getRecords()
}

const getRecordsPagination = ({ pagination }) => {
  recordsPagination.value = pagination
  getRecords()
}
</script>
