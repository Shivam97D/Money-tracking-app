/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './App.css'

function App() {

      const [ name , setvalue ] = useState( '' ) ;
      const [ date , setDate ] = useState( '' ) ;
      const [ desc , setDesc ] = useState( '' ) ;
      const [ transactions , setTransactions ] = useState( [] ) ;
      const [ transactionStatus , setTransactionStatus ] = useState( ' ' ) ;
      useEffect ( () => {
            getTransactions().then( josnTransactions => {
                  setTransactions( josnTransactions )
            } ) ;      
      } , [] ) ;
      
      async function getTransactions( ) {
            const url = import.meta.env.VITE_API_URL+'/transactions/done'
            const response = await fetch( url ) ;
            const josnTransactions = await response.json() ;
            return josnTransactions ;
      }

      function addNewTransaction( event ) {
            event.preventDefault();
            setTransactionStatus( 'loading' ) ;
            const url = import.meta.env.VITE_API_URL+'/transaction/add' ;
            // console.log(url);
            fetch(
                  url ,
                  {
                        method : 'POST' ,
                        headers : {'Content-type' : 'application/json' },
                        body : JSON.stringify( {name , desc , date }) ,

                  }).then( res => {
                        res.json().then(json=>{
                              setvalue( "" ) ;
                              setDesc( '' ) ;
                              setDate( "" ) ;
                              console.log(json)
                              setTransactionStatus( 'done' ) ;
                              setTimeout(() => {
                                    setTransactionStatus( ' ' ) ;
                                    getTransactions().then( josnTransactions => {
                                          setTransactions( josnTransactions )
                                    } ) ;
                              }, 5000);
                        }).catch( err => {
                              console.log(err)
                              setTransactionStatus( 'error' ) ;
                        }     )
                  } )
      }

      let balance = 0 ;
      for( const transaction of transactions ){
            balance += ( isNaN(Number( transaction.name )) ? 0 : Number(transaction.name) )   ;
      }

  return (
    <>
      <div className="screen flex flex-col gap-4 items-center">
        <div className="adder">
          <div className="bal text-5xl ">
            ₹ { balance } /-  
          </div>
          <form onSubmit={ addNewTransaction } className=" flex flex-col gap-3 m-5  w-full h-2/5 items-center justify-center ">
            <div className="info1 flex gap-3 w-2/4  justify-center">
                <input value={ name } onChange={ ev => { setvalue( ev.target.value )}} className=" w-2/3 bg-transparent border border-white border-solid  rounded-md  p-2 text-black-900 " type="text" placeholder='+1,00,000' required />
                <input value={ date } onChange={ ev => { setDate( ev.target.value )}} className=" w-2/3 bg-transparent border border-white border-solid  rounded-md  p-2 text-black-900 " type="date" placeholder=' DD/MM/YY ' required />
            </div>
            <div className="description  w-full h-2/5 flex bg-transparent justify-center items-center ">
                <input value={ desc } onChange={ ev => { setDesc( ev.target.value )}} type="text" className="p-2 px-3 border rounded-md bg-transparent w-3/6"  placeholder='Reason or description.' required />
            </div>
            <div className="submit-new  w-full flex justify-center items-center  ">
                <input type="submit" className=' bg-white text-black font-bold w-3/6 rounded-md p-2' placeholder='Add new transaction' value="Add new Transaction" />
            </div>
          </form>
          <div className="status">
            { transactionStatus === "loading" &&  <div className="loading">Loading....</div>}
            { transactionStatus === "done" &&  <div className="done">Done...👍</div>}
            { transactionStatus === "error" &&  <div className="error">Something went wrong....❌</div>}
          </div>
        </div>

        <div className="list-container  w-2/5 py-5 rounded-md flex flex-col gap-3 ">

            { transactions.length > 0 && 
                  transactions.map( 
                        ( transaction , i )  => (
                              <div key={ i } className="card  flex justify-between p-2 border-b   ">
                                    <div className="card-title w-2/4 text-xl ">
                                          { transaction.desc }
                                    </div>
                                    <div className="card-details w-2/4  flex flex-col items-end text-lg">
                                          <div className={"amount "+ ( Number(transaction.name) < 0 ? "text-red-700" : 'text-green-600' )  }>
                                                { transaction.name}
                                          </div>
                                          <div className="date">
                                                { new Date(transaction.date).toLocaleDateString( "en-US" , {
                                                      year : "numeric" ,
                                                      month : "long" ,
                                                      day : "numeric" ,
                                                } )  }
                           
                                          </div>
                                    </div>
                              </div>
                        )
                   )
            }


              

            
        </div>
      </div>
    </>
  )
}

export default App
