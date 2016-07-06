class window.measureSpeed
    constructor: (options, done, process)->
        @measureAttempts = options.attempts or 15
        @testFileSrc = options.src or "http://st.nim.space/gen.gif"
        @testFileLength = options.length or 1048576

        measureProcess = new $.Deferred()
        measurements = []
        attempts = 0
        average =
            mbps: 0
            mbs: 0
            bs: 0
            delta: 0

        measureProcess.progress (data)=>
            attempts++

            speed =
                delta: data.delta
                bs: data.bs
                mbps: data.bs / (1024*1024)
                mbs: (data.bs / (1024*1024)) * 8

            #Add new measurement
            measurements.push speed
            #Set first measurement like average
            if attempts <= 1
                average = _.extend {}, speed

            else
                #Calculate sum of all measurements
                measurementsSumm = _.reduce measurements, (measurement, summ)->
                    newSumm =
                        delta: summ.delta + measurement.delta
                        bs: summ.bs + measurement.bs
                        mbps: summ.mbps + measurement.mbps
                        mbs: summ.mbs + measurement.mbs

                    return newSumm

                #Compute the average value of the current measurement
                for field of measurementsSumm
                    average[field] = measurementsSumm[field]/attempts

            process?({speed: speed, average: average, attempts: attempts, attemptsPercent: attempts/@measureAttempts})

            if attempts >= @measureAttempts
                measureProcess.resolve {speed: measurements, average: average}

            else
                @measureSpeed measureProcess

        measureProcess.done (speedResults)->
            done?(speedResults)

        @measureSpeed measureProcess

        return measureProcess

    measureSpeed: (deferr)->
        testImg = new Image()
        startTime = new Date()
        testImg.onload = ()=>
            delta = new Date() - startTime
            speed = @getSpeed @testFileLength, delta
            deferr.notify {bs: speed, delta: delta}

        testImg.src = @testFileSrc + '?_=' + Math.random()

    getSpeed: (size, time)->
        time = time/1000
        speed = size/time
        return speed