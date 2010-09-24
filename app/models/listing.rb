class Listing < ActiveRecord::Base

  MIN_PRICE = 0
  MAX_PRICE = 10_000_000
  PRICE_RANGE = 50_000

  def self.random
    find(:first, :offset => (count * rand).to_i)
  end

  def full_image_url
    FbPropertyGame::Application.config.image_base_url + image_url
  end

  def as_json
    {
      :id         => id,
      :price      => price,
      :price_view => price_view,
      :bedrooms   => bedrooms,
      :bathrooms  => bathrooms,
      :suburb     => suburb.downcase.gsub(/\b([a-z])/) { |match| match.upcase },
      :state      => state.upcase,
      :postcode   => postcode,
      :image_url  => full_image_url,
    }
  end

  def self.similar_to(listing)
    price_min = [ MIN_PRICE, listing.price - PRICE_RANGE ].max
    price_max = [ listing.price + PRICE_RANGE, MAX_PRICE ].min

    ## TODO find something more optimal - maybe ORDER BY RAND() ?
    ## TODO expand search if total is zero?
    total = where({ :price => price_min..price_max }).size
    find(:first, :offset => rand(total), :conditions => { :price => (price_min..price_max) })
  end
end
