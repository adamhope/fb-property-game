class ListingsController < ApplicationController
  respond_to :json, :xml

  def show
    respond_with Listing.find(params[:id])
  end

  def show_random
    respond_with Listing.random
  end

  def similar_to
    listing = Listing.find(params[:id])
    respond_with Listing.similar_to(listing)
  end

end
