import React, { useCallback, useEffect, useState } from 'react'

import { Spinner } from 'react-bootstrap'
import Apexchart from 'react-apexcharts'
import { getTotal } from '../redux/actions/itemActions'
import { connect } from 'react-redux'
import { TotalProfit } from "../components/TotalProfit";

const TotalPieChart = ({ getTotal, total, loading }) => {
  const [overAll, setOverAll] = useState([])
  const [todayProfit, setTodayProfit] = useState([])
  const [options, setOptions] = useState({
    options: {
      chart: {
        width: 360,
        type: 'pie',
      },
      labels: [],
    },
  })
  const [series, setSeries] = useState([])

  const getDataChart = useCallback(() => {
    try {
      setOverAll(
        total.map((item) => {
          if (item.currency[0] === 'USD') {
            return Math.floor(item.avgPrice * item.usdRub)
          } else {
            return Math.floor(item.avgPrice)
          }
        })
      )
      setTodayProfit(
        total.map((item) => {
          if (item.currency[0] === 'USD') {
            return Math.floor(
              item.c * item.sum * item.usdRub - item.o * item.sum * item.usdRub
            )
          } else {
            return Math.floor(item.c * item.sum - item.o * item.sum)
          }
        })
      )
      setSeries(
        total.map((item) => {
          if (item.currency[0] === 'USD') {
            return Math.floor(item.c * item.sum * item.usdRub)
          } else {
            return Math.floor(item.avgPrice)
          }
        })
      )
      setOptions({
        options: {
          chart: {
            width: 360,
            type: 'pie',
          },
          labels: total.map((item) => item._id),
          legend: {
            position: 'bottom',
            show: true,
          },
          plotOptions: {
            pie: {
              expandOnClick: true,
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => {
                        return a + b
                      }, 0)
                    },
                    label: 'Total, ₽',
                  },
                },
              },
            },
          },
        },
      })
    } catch (e) {}
  }, [total])

  useEffect(() => {
    getTotal()
    
  }, [getTotal])

  useEffect(() => {
    getDataChart()
  }, [getDataChart])


  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner animation="border" />
      </div>
    )
  }
  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <TotalProfit total={series} overAll={overAll} todayProfit={todayProfit}/>
      <Apexchart
        options={options.options}
        series={series}
        type="donut"
        width={360}
      />
    </div>
  )||<div>Пока ничего нет</div>
}

const mapStateToProps = (state) => ({
  total: state.item.total,
  loading: state.item.loading,
})

export default connect(mapStateToProps, { getTotal })(TotalPieChart)
