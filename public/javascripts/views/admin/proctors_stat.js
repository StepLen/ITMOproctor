define([
	"i18n",
	"text!templates/admin/proctors_stat.html",
	"bower_components/highcharts/highcharts.js"
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
		},
		// Запросы на сервер из вьюхи, окей.
		getStat: function () {
			
		}
	});
	return View;
});
