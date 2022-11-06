package lens

import (
	"github.com/sirupsen/logrus"
	"gopkg.in/natefinch/lumberjack.v2"
)

var LOG *logrus.Logger = nil

var logConf = &lumberjack.Logger{
	// output path
	Filename: "./lens.log",
	// max size / MB
	MaxSize: 500, // megabytes
	// max log files count
	MaxBackups: 5,
	// max expired days
	MaxAge: 28, //days
	// compress, use gzip
	Compress: true, // disabled by default
}

var lensLog *logrus.Logger = nil

func init() {
	lensLog = Logger()
}

func Logger() *logrus.Logger {

	if lensLog == nil {
		LOG = logrus.New()

		// if Environment == "production" {
		// 	log.SetFormatter(&log.JSONFormatter{})
		//   } else {
		// 	// The TextFormatter is default, you don't actually have to do this.
		// 	log.SetFormatter(&log.TextFormatter{})
		//   }
		// }

		LOG.SetFormatter(&logrus.TextFormatter{
			DisableColors: false,
			FullTimestamp: true,
		})

		LOG.SetOutput(logConf)

	}
	return LOG
}
