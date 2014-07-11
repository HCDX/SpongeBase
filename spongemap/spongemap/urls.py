from django.conf.urls import patterns, include, url



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'spongemap.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),


    url(r'^mongonaut/', include('mongonaut.urls')),
)
