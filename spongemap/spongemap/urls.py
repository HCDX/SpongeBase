from django.conf.urls import patterns, include, url

from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'spongemap.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', TemplateView.as_view(template_name='spongemap.html')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^mongonaut/', include('mongonaut.urls')),
)
