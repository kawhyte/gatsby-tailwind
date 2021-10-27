/* eslint-disable react/prop-types */
import React, { useState,useEffect  } from 'react'
import { Link } from 'gatsby'
import Navbar from './navBar'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import DataGroup from './common/dataGroup.jsx'


import { GetDataFromAPI } from '../util/getAPIData'
//import { GetEmploymentDataFromAPI } from '../util/getEmpolymentAPIData'
//import { GetWithholdingDataFromAPI } from '../util/getWithholdingAPIData'
import { statusOptions, stateOptions } from '../util/dropDownData'


import {
  isBillNew,
  didBillFailGovernor,
  didBillPassGovernor,
  isUpdateMajor,
  //getBillActions,
  //getBillIntroduction,
  //didBillPassHouse,
  //didBillPassSenate,
} from '../util/helper.js'

let data = []
const animatedComponents = makeAnimated()

function DisplayList({ type, text }) {

    switch (type) {
        case 'leave':
          data = GetDataFromAPI()
    
          break
        case 'employment':
          //data = GetEmploymentDataFromAPI()
    
          break
        case 'withholding':
          //data = GetWithholdingDataFromAPI()
    
          break
    
        default:
          data = []
          console.log('No data found ')
          break
      }
    
      const openStateQuery = [
        ...data.OpenState.query2.edges,
        ...data.OpenState.query1.edges,
      ]





    const emptyQuery = ''
    const [state, setState] = useState({
      bills: openStateQuery.sort(
        (a, b) => new Date(b.node.createdAt) - new Date(a.node.createdAt)
      ),
      query: emptyQuery,
      stateValue: '',
      statusValue: '',
    })

    const [newBillCount, setNewBillCount] = useState(0)
    const [failedBillCount, setFailedBillCount] = useState(0)
    const [governorSignedBillCount, setGovernorSignedBillCount] = useState(0)


    // const [pageState, setPageState] = useState({
    //   bills: openStateQuery,
    //   currentPage: 1,
    //   pageSize: 15,
    // })

console.log(state)

function customTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'lightblue',
      primary: 'indigo',
    },
  }
}


useEffect(() => {
  openStateQuery.map((c) => {
    const newBill = isBillNew(c.node.actions)

    const failed = didBillFailGovernor(c.node.actions)
    // const governorBillPassed = didBillPassGovernor(c.node.actions)
    const isMajor = isUpdateMajor(c.node.actions)

    if (newBill) {
      setNewBillCount((prevCount) => prevCount + 1)
    }

    if (isMajor) {
      setGovernorSignedBillCount((prevCount) => prevCount + 1)
    }

    if (failed) {
      setFailedBillCount((prevCount) => prevCount + 1)
    }
    //return counters
  })
}, [])


    const handleInputChange = (event) => {
        const query = event.target.value
    
        const billsToBeFiltered = openStateQuery || []
        //  const billsToBeFiltered =  state.bills  || []
    
        const bills = billsToBeFiltered.filter((bill) => {
          const { identifier, legislativeSession } = bill.node
          return (
            identifier
              .replace(/\s+/g, '')
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            (legislativeSession.jurisdiction.name &&
              legislativeSession.jurisdiction.name
                .toLowerCase()
                .includes(query.toLowerCase()))
          )
        })
    
        setState({
          query,
          bills: bills,
        })
      }

      const handleStatusChange = (event) => {
        console.log(event + ' was clicked')
    
        const query = event
        // console.log('MY current STATE is ', state.stateValue)
        // console.log('MY current Status is ', state.statusValue)
    
        if (query === null) {
          setState({
            query,
            bills: openStateQuery,
          })
          return
        }
    
        const billsToBeFiltered = openStateQuery || []
        //const billsToBeFiltered = state.bills || []
    
        if (event === 'all') {
          setState({ query, bills: openStateQuery })
        }
    
        if (event === 'new') {
          let bills = billsToBeFiltered.filter((bill) => {
            let val = isBillNew(bill.node.actions)
    
            if (val === true) {
              return bill
            }
          })
    
          // console.log('BILLS ', bills)
          // console.log('stateValue ', state.stateValue)
    
          if (state.stateValue) {
            bills = bills.filter(
              (item) =>
                item.node.legislativeSession.jurisdiction.name === state.stateValue
            )
          }
    
          // console.log('FILTERED', bills)
          setState({
            query,
            bills: bills,
            statusValue: event,
            stateValue: state.stateValue,
          })
        }
    
        if (event === 'major') {
          let bills = billsToBeFiltered.filter((bill) => {
            let val = isUpdateMajor(bill.node.actions)
    
            if (val === true) {
              return bill
            }
          })
    
          if (state.stateValue) {
            bills = bills.filter(
              (item) =>
                item.node.legislativeSession.jurisdiction.name === state.stateValue
            )
          }
    
          setState({
            query,
            bills: bills,
          })
        }
    
        if (event === 'passed') {
          let bills = billsToBeFiltered.filter((bill) => {
            let val = didBillPassGovernor(bill.node.actions)
    
            if (val !== null) {
              return bill
            }
          })
    
          if (state.stateValue) {
            bills = bills.filter(
              (item) =>
                item.node.legislativeSession.jurisdiction.name === state.stateValue
            )
          }
          setState({
            query,
            bills: bills,
          })
        }
    
        if (event === 'failed') {
          let bills = billsToBeFiltered.filter((bill) => {
            let val = didBillFailGovernor(bill.node.actions)
    
            if (val !== null) {
              return bill
            }
          })
    
          if (state.stateValue) {
            bills = bills.filter(
              (item) =>
                item.node.legislativeSession.jurisdiction.name === state.stateValue
            )
          }
    
          setState({
            query,
            bills: bills,
          })
        }
    
        //console.log("statusValue END",state.statusValue)
      }

      const handleStateChange = (event) => {
        let query = event
    
        if (query === null) {
          setState({
            query,
            bills: openStateQuery,
          })
          return
        }
    
        // console.log('handleStateChange MY current STATE is ', state.stateValue)
        // console.log(' handleStateChange MY current Status is ', state.statusValue)
    
        //const billsToBeFiltered = openStateQuery || []
        const billsToBeFiltered = state.bills || []
        // console.log('openStateQuery^^ --', openStateQuery)
        // console.log('STATE^^ --', state.bills)
        let bills = billsToBeFiltered.filter((bill) => {
          const { legislativeSession } = bill.node
    
          return (
            legislativeSession.jurisdiction.name &&
            legislativeSession.jurisdiction.name.toLowerCase() ===
              query.toLowerCase()
          )
        })
    
        //console.log('BILLSIN1', bills)
    
        if (state.statusValue) {
          bills = bills.filter(
            (item) =>
              item.node.legislativeSession.jurisdiction.name === state.statusValue
          )
        }
    
        //console.log('filtered1', bills)
        setState({
          query,
          bills: bills,
          statusValue: state.statusValue,
          stateValue: event,
        })
      }

    return (
        <>
        <Navbar onChange={handleInputChange}  text={text}/>

        <div className="flex justify-center ">
        <DataGroup
          actions={state}
          newBills={newBillCount}
          failedBills={failedBillCount}
          passBills={governorSignedBillCount}
          billTotal={openStateQuery.length}
          // currentPage={pageState.currentPage}
          // pageSize={pageState.pageSize}
        />
      </div>

      <div>
      
      <div className=" flex  flex-col  mb-12 px-8 py-8 rounded-3xl mx-auto max-w-3xl bg-blue-100">
          <p className="hidden sm:block text-lg font-bold mb-3">Filter</p>
          <div className=" flex flex-col sm:flex-row justify-between  align-bottom w-full ">
            <div className="font-medium text-gray-600 sm:w-5/12 sm:mr-4 ">
              <Select
                options={statusOptions}
                components={animatedComponents}
                theme={customTheme}
                isClearable
                //onChange={setbillFilterItem}
                //onChange={values => handleClicked(values.map(type => type.value))}
                onChange={(values) =>
                  handleStatusChange(values ? values.value : null)
                }
                noOptionsMessage={() => 'no options left'}
                defaultValue={'hi'}
                placeholder="All bills"
                className="mb-3"
                isSearchable
              />
            </div>

            <div className="font-medium text-gray-600 sm:w-5/12">
              <Select
                options={stateOptions}
                components={animatedComponents}
                theme={customTheme}
                defaultValue={'test'}
                isClearable
                //onChange={setbillFilterItem}
                //onChange={values => handleClicked(values.map(type => type.value))}
                onChange={(values) =>
                  handleStateChange(values ? values.label : null)
                }
                noOptionsMessage={() => 'no options left'}
                placeholder="All states"
                className="mb-3"
                isSearchable
              />
            </div>

            <div className="flex items-center justify-end  font-light px-1 mx-1 text-sm text-indigo-600 sm:w-2/12">
              {state.bills.length}{' '}
              {openStateQuery.length > 1 ? 'bills' : 'bill'} found
            </div>
          </div>

          <div className=" md:hidden  sm:ml-6 mt-6 ">
            <div className="flex justify-between ">
              <Link to="/dashboard" className="" aria-current="page">
                <button className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-indigo-600 rounded shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none">
                  PFL
                </button>
              </Link>
              <Link to="/employment" className="" aria-current="page">
                <button className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-indigo-600 rounded shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none">
                  UnEmployment
                </button>
              </Link>
              <Link to="/withholding" aria-current="page">
                <button className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-indigo-600 rounded shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none">
                  Withholding
                </button>
              </Link>
            </div>
          </div>
        </div>
      
      </div>
        </>
    )
}

export default DisplayList
