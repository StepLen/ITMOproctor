define([
	"i18n",
	"text!templates/admin/proctors_stat.html",
	"bower_components/highcharts/highcharts.js",
], function (i18n, template) {
	console.log('views/admin/students_stat.js');
	var View = Backbone.View.extend({
		dataStats: {},
		initialize: function (options) {
			this.templates = _.parseTemplate(template);
		},
		destroy: function () {
			for (var v in this.view) {
				if (this.view[v]) this.view[v].destroy();
			}
			this.remove();
		},
		render: function () {
			var self = this;
			var tpl = _.template(this.templates['main-tpl']);
			var data = {
				i18n: i18n
			};
			this.$el.html(tpl(data));
			$.parser.parse(this.$el);

			this.drawChart(this.$el.find('#chart'))
		},


		// Запросы на сервер из вьюхи, окей.
		drawChart: function ($chart) {

			Highcharts.setOptions({
				lang: {
					loading: 'Загрузка...',
					months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
					weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
					shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
					exportButtonTitle: "Экспорт",
					printButtonTitle: "Печать",
					rangeSelectorFrom: "С",
					rangeSelectorTo: "По",
					rangeSelectorZoom: "Период",
					downloadPNG: 'Скачать PNG',
					downloadJPEG: 'Скачать JPEG',
					downloadPDF: 'Скачать PDF',
					downloadSVG: 'Скачать SVG',
					printChart: 'Напечатать график'
				}
			});


			Backbone.$.getJSON('/admin/proctor_stat').then(function (raw) {
				var data = {
					proctors: [],
					statData: []
				};
				var counter = 0;

				if(raw.error || !raw.data) {
					return false;
				}

				_.each(raw.data, function (p) {

					console.log(p);


					data.proctors[counter] = p.lastname + ' ' + p.firstname + ' ' + p.middlename;
					data.statData[counter] = Array.isArray(p.exams) ? p.exams.length : 0
					counter++;
				});


				// Create the chart
				$chart.highcharts({
					credits: {
						enabled: false
					},
					chart: {
						type: 'bar'
					},
					title: {
						text: i18n.t('admin.stat.proctorsStatFull')
					},
					xAxis: {
						categories: data.proctors,
						labels: {
							formatter: function () {
								var words = this.value.toString().trim().split(/[\s]+/);
								var numWordsPerLine = 2;
								var str = [];

								for (var word in words) {
									if (word > 0 && word % numWordsPerLine == 0)
										str.push('<br>');

									str.push(words[word]);
								}

								return str.join(' ');
							}
						}
					},
					yAxis: {
						min: 0,
						allowDecimals: false,
						title: {
							text: ''
						}
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						series: {
							stacking: 'normal'
						}
					},
					series: [
						{
							name: i18n.t('admin.stat.proctorsExams'),
							data: data.statData
						}
					]
				});
			});

		}
	});
	return View;
});
