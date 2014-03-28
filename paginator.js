
var Paginator = Backbone.View.extend({

	tagName: "div",
	className: "pagination pagination-right",

	/*
	*	Constructor
	*/
	initialize: function(params) {

		this.current_page 			= 0;
		this.page_size 				= params.page_size ? params.page_size : 10;
		this.url 					= params.url;
		this.data 					= params.data;
		this.showDataCallBack 		= params.showDataCallBack;
		this.paginator_container 	= params.paginator_container;

	},

	/*
	*	Onclick evented related to any <li> tag without "active" class
	*/
	events: {
		"click li:not(.active)": "changePage"
	},

	/*
	*	Loading and sending data to callback rendering function
	*/
	load: function() {

		var me = this;

		me.data['start'] = (me.current_page * me.page_size);
		me.data['limit'] = me.page_size;
		
		$.ajax({
	        dataType: 'json',
	        url: me.url,
	        async: true,
	        data: me.data,
			
	        success: function(data) {		
				if(data['results']!='' || me.current_page==0){
					
					me.showDataCallBack(data['results']);
					me.render(data['founds']);
				}
				else{					
					me.current_page = me.current_page-1;
					me.load();
				}
	        },
			
			error: function(data){
				console.log(data);
			}

	    });

	},


	/*
	*	Painting pagination control
	*/
	render: function(total_rows_found) {

		pages = Math.ceil(total_rows_found / this.page_size);
		
		var strHtml = '<ul>';
		
		for (i = 0; i < pages; i++)

			strHtml += 
				'<li data-page="' + i + '"' + (i == this.current_page ? ' class="active" style="cursor:pointer;"' : '') + '><a href="#">' + (i + 1) + '</a></li>';

		strHtml += '</ul>';

		this.$el.empty();
		this.$el.append(strHtml);

		$('#' + this.paginator_container).empty();
		$('#' + this.paginator_container).append( this.$el );

		this.delegateEvents();
		
	},

	/*
	*	Change page onclick non-active <li>
	*/
	changePage: function(event) {
		
		this.current_page = parseInt( $(event.currentTarget).attr("data-page") );
		this.load();

	}

});
