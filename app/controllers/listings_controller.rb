class ListingsController < ApplicationController
  respond_to :json, :xml

  def show
    respond_with Listing.find(:first, :conditions => { :id => params[:id] })
  end

  def show_random
    respond_with Listing.random
  end

end
